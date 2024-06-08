//var yourdesccolor = "#87CEFA";
var desccolor = [30, 144, 255];
var mdesccolor = desccolor;
var ydesccolor = desccolor;
var yourdesccolor = "rgb(" + desccolor[0] + "," + desccolor[1] + "," + desccolor[2] + ")";
var mydesccolor = "rgb(" + desccolor[0] + "," + desccolor[1] + "," + desccolor[2] + ")";
var cellcolor = "blue";
var restrictedarea = "#1E90FE";//заливка запретной зоны вокруг корабля
var shipcolor = "#C0C0C0";
var projectcolor = "cyan";
var destroycolor = [0, 0, 128];//"#000080";
var Desc1CoordX = 0;
var Desc1CoordY=0;
//var Desc2CoordX=550;
//var Desc2CoordY=100;
var DescWidth=500;
var CellWidth=DescWidth/10;
var PG; //все игровое поле
var MC; //основной холстdraw
var context, contextback;
var MDIMG, MyDeskName; //изображение моей доски 
var YDIMG, YourDeskName; //изображение доски противника
var StBut, NextBut, RtBut; //кнопка
var State; //0 - готова только моя доска, 1 - готова доска противника
var CurState; //0 - активна моя доска, 1 - активна доска противника
var IsConfirmPos; //0 - начало выбора позиций кораблей, 1 - все позиции выбрана
var CurShipType; //1,2,3,4
var GameState; //0(4) - старт (конец игры), 1 - раставляю свои корабли, 2 - стреляю я, 3 - стреляет противник
var arMyShips, arYourShips;//массивы кораблей
var cntMyShipsDamaged, cntYourShipsDamaged;
var arDamagedShip;//ячейки поврежденного корабля
var arYourDesk, arMyDesk;//массивы ячеек доски
var NumX, NumY; //текущие координаты клика
var IsInjury;
var gororvert;
//var NumXInjury,NumYInjury;//???
var CurShip;
var IsMiss//Признак попадания в корабль
var AudioNear, AudioFaraway, AudioInterface, IsNoise;
var MyTotalScore;
var YourTotalScore;
var MyCurScore;
var YourCurScore;
//var IsInjuryCounter = 0;//счетчик обстрела соседей подбитой ячейки


function fShowMyDesk()
{
    fimage2canvas(1);

}

function fShowYourDesk()
{
    fimage2canvas(2);
}

//==============================================
// Отрисовка игрового поля
//==============================================
function fDraw(x)
{
    var cntx, dsccolor;;
    if (x == 1) {
        cntx = context;
        dsccolor = mydesccolor;
        MC.onclick = fCanvasCoords;

    } 
    if (x == 2){
        cntx = contextback;
        dsccolor = yourdesccolor;
        MCB.onclick = fCanvasCoords;
    }
    cntx.clearRect(0, 0, MC.width, MC.height);

    cntx.beginPath();
    cntx.fillStyle = dsccolor;
	cntx.fillRect(Desc1CoordX, Desc1CoordY, DescWidth, DescWidth);
	
    //Рисуем ячейки для доски
	cntx.strokeStyle = cellcolor;
	cntx.lineWidth = 1;
	for(var i=1;i<10;i++){
	    cntx.moveTo(Desc1CoordX+CellWidth*i,Desc1CoordY);
	    cntx.lineTo(Desc1CoordX+CellWidth*i,Desc1CoordY+DescWidth);
	}
	for(var i=1;i<10;i++){
	    cntx.moveTo(Desc1CoordX,Desc1CoordY+CellWidth*i);
	    cntx.lineTo(Desc1CoordX+DescWidth,Desc1CoordY+CellWidth*i);
	}
	
	cntx.stroke();

	Canvas2Img(x);//переносим доску в миниатюру
	return true
}

//=================================================
// Обработка загрузки html страницы
//=================================================
function fStart()
{
    MDIMG = document.getElementById("MyDesk");
    YDIMG = document.getElementById("YourDesk");
    MyDeskName = document.getElementById("MyDeskName");
    YourDeskName = document.getElementById("YourDeskName");
    MC = document.getElementById("MainCanvas");
    MCB = document.getElementById("MainCanvasBack");
    MSG = document.getElementById("Message");
    StBut = document.getElementById("StBut");
    NextBut = document.getElementById("NextBut");
    RtBut = document.getElementById("RtBut");
    AudioNear = document.getElementById("AudioNear");
    AudioFaraway = document.getElementById("AudioFaraway");
    AudioInterface = document.getElementById("AudioInterface");
    IsNoise = document.getElementById("IsNoise");
    context = MC.getContext("2d");
    contextback = MCB.getContext("2d");
    context.lineWidth = 1;
    PG = document.getElementById("PlayGround");
    MyTotalScore = document.getElementById("MyTotalScore");
    YourTotalScore = document.getElementById("YourTotalScore");
    MyCurScore = document.getElementById("MyCurScore");
    YourCurScore = document.getElementById("YourCurScore");
    CurState = 0;
    arMyShips = new Array();
    arYourShips = new Array();
    arYourDesk = new Array(10);
    arMyDesk = new Array(10);
    arDamagedShip = [];
    GameState = 0;
    //fimage2canvas(1);
    NextBut.style.display = "None";
    RtBut.style.display = "None";
    //PG.style.visibility = "visible";
	if (Modernizr.canvas)
	{
		//alert(navigator.userAgent);
	    fDraw(1);//рисуем переднюю игровую доску
	    fDraw(2);//рисуем заднюю игровую доску
		State=0;
	}
	else
	{
		PG.innerHTML="Your browser " + navigator.userAgent + " NOT support HTML5 element Canvas";
	}
	//var WB=document.getElementById("WellcomeButton");
	//WB.innerHTML="";
	return true;
}

function fStop(e) {
    e.returnValue = "test";
    return "test";
}

//=================================================
// Обработка клика на холсте
//=================================================
function fCanvasCoords(e)
{

    if (GameState == 0 || GameState==4) {
        $('#notstarted').dialog('open');
        return;
    }

    var DW = document.getElementById("DebugWindow");
    var CoordX = Math.round(e.pageX - getCoords(MC).left);
    var CoordY = Math.round(e.pageY - getCoords(MC).top);
    var x0, y0, x1, y1, index, index2;
    var IterCnt = 0;//счетчик для защиты от вечного цикла
    NumX = Math.floor(CoordX / CellWidth);
    if (NumX==10) NumX=9;
    NumY = Math.floor(CoordY / CellWidth);
    if (NumY == 10) NumX = 9;
    //DW.innerHTML = NumX + " " + NumY;// + " " + getCoords(MC).top + " " + getCoords(MC).left;

    //=========== поворот+перемещение моего корабля при растановке==================
    if (IsConfirmPos != 1 && GameState==1 && CurState==0) {
        CurShip.Clear(context, mydesccolor);
        if (CurShip.SetPos(context, NumX, NumY)) {
            NextBut.style.display = "block";//активируем кнопку для установки следующего корабля
            if (CurShip.type > 1) {
                RtBut.style.display = "block";//активируем кнопку поворота, если устанавливаемый корабль многопалубный
            }
        }
        CurShip.Draw(false, context);
        Canvas2Img(1);
    }
    //============= СТРЕЛЬБА ================
    //index>=0 - номер ячейки корабля
    //index=-1 - пустая ячейка
    //index=-2 - запрещенная зона вокруг корабля шириной в одну ячейку
    //index=-3 - прострелянная ячейка
    //==== стрельба по противнику =====
    if (GameState == 2 && CurState == 1) {
        index = arYourDesk[NumX][NumY];
        if (index < 0 && index >-3) {//попал в пустую ячейку
            fDrawHit(2);
            Canvas2Img(2);
            arYourDesk[NumX][NumY] = -3;
         
            //==============ход противника ==============
            GameState = 3;
            
            fimage2canvas(1);//переносим мое поле игры на холст из img
            do {
                IterCnt += 1;//контролируем число итераций, чтобы не уйти в вечный цикл
                NumX = NumY = -1;//сброс координат первой чистой ячейки
                if (!IsInjury) {//до этого небыло результативного попадания
                    if (IterCnt < 50){//защита от бесконечных итераций
                        NumX = fgetRandomInRange(0, 9);
                        NumY = fgetRandomInRange(0, 9);
                    } else {//в случае певышения числа циклов выбираем первую свободную
                        //DW.innerHTML = DW.innerHTML + "|X";
                        for (i=0; i<=9; i++ ){
                            for(j=0; j<=9; j++){
                                if (arMyDesk[i][j] == -1 || arMyDesk[i][j] >=0) {
                                    NumX = i;
                                    NumY = j;
                                    IterCnt = 0;
                                    break;
                                }
                            }
                            if (NumX != -1 && NumY != -1) {
                                break;
                            }
                        }
                    }
                }
                else {//до этого было результативное попадание
                    //получаем координаты предыдущего попадания
                    if (arDamagedShip.length != 0) {
                        var NumXInjury = arDamagedShip[0][0];
                        var NumYInjury = arDamagedShip[0][1];
                        arDamagedShip[0][2] = arDamagedShip[0][2] + 1;
                        var IsInjuryCounter = arDamagedShip[0][2];

                        //находим расположение корабля: 1 - горизонтально 2 - вертикально
                        if (arDamagedShip.length >= 2) {
                            if (arDamagedShip[0][0] == arDamagedShip[1][0]) {
                                gororvert = 2;
                            }
                            else {
                                gororvert = 1;
                            }
                        }

                        if (gororvert == 2) {
                            if (IsInjuryCounter <= 1) {
                                arDamagedShip[0][2] = 1;
                                IsInjuryCounter = arDamagedShip[0][2];
                            } else {
                                arDamagedShip[0][2] = 3;
                                IsInjuryCounter = arDamagedShip[0][2];
                            }
                        }

                        if (gororvert == 1) {
                            if (IsInjuryCounter <= 2) {
                                arDamagedShip[0][2] = 2;
                                IsInjuryCounter = arDamagedShip[0][2];
                            } else {
                                arDamagedShip[0][2] = 4;
                                IsInjuryCounter = arDamagedShip[0][2];
                            }
                        }

                        //=== проверка окрестностей предыдущего попадания
                        var zagranica1 = false, zagranica2 = false, zagranica3 = false, zagranica4 = false;
                        //NumX = -1;
                        //NumY = -1;
                        if (IsInjuryCounter == 1) {
                            if (NumXInjury >= 0 && NumXInjury <= 9 && (NumYInjury - 1) >= 0 && (NumYInjury - 1) <= 9) {
                                NumX = NumXInjury;
                                NumY = NumYInjury - 1;
                            } else {
                                zagranica1 = true;
                            }
                        }

                        if (IsInjuryCounter == 2 || zagranica1) {
                            if ((NumXInjury + 1) >= 0 && (NumXInjury + 1) <= 9 && NumYInjury >= 0 && NumYInjury <= 9) {
                                NumX = NumXInjury + 1;
                                NumY = NumYInjury;
                            } else {
                                zagranica2 = true;
                            }
                        }

                        if (IsInjuryCounter == 3 || zagranica2) {
                            if (NumXInjury >= 0 && NumXInjury <= 9 && (NumYInjury + 1) >= 0 && (NumYInjury + 1) <= 9) {
                                NumX = NumXInjury;
                                NumY = NumYInjury + 1;
                            } else {
                                zagranica3 = true;
                            }
                            if (gororvert == 2) { arDamagedShip.shift(); }
                        }

                        if (IsInjuryCounter == 4 || zagranica3) {
                            if ((NumXInjury - 1) >= 0 && (NumXInjury - 1) <= 9 && NumYInjury >= 0 && NumYInjury <= 9) {
                                NumX = NumXInjury - 1;
                                NumY = NumYInjury;
                            } else {
                                zagranica4 = true;
                            }
                            if (gororvert == 1) { arDamagedShip.shift(); }
                        }

                        if (NumX == -1 && NumY == -1) {
                            NumX = fgetRandomInRange(0, 9);
                            NumY = fgetRandomInRange(0, 9);
                        }
                    //} else {
                    //    NumX = fgetRandomInRange(0, 9);
                    //    NumY = fgetRandomInRange(0, 9);
                    //}
                    } else {
                        alert("Errors. Send message to admin.");
                    }

                    //в данной точки мы получили координаты следующего выстрела

                }



                index2 = arMyDesk[NumX][NumY];//тип ячейки
                //======================= Интеллект противника - ограничения на ячейки
                //======================= (1) Не стрелять в притык к подбитому кораблю

                for (var i = -1;  i <= 1; i++) {//проверяем все соеседей на цвет
                    for (var j = -1; j <= 1; j++) {
                        if (j == 0 && i==0) {
                            continue;
                        }
                        var coordx = (NumX + i) * CellWidth + CellWidth / 2;
                        var coordy = (NumY + j) * CellWidth + CellWidth / 2;
                        var imdData = context.getImageData(coordx, coordy, 1, 1);
                        var pixels = imdData.data;
                        var red = pixels[0];
                        var green = pixels[1];
                        var blue = pixels[2];
                        var alpha = pixels[3];

                        if ((red == destroycolor[0] && green == destroycolor[1] && blue == destroycolor[2] && alpha == 255) && (index2 == -1)) {
                            index2 = -2;//ячейка попадания находится около подбитого корабля - стреляем еще раз
                            arMyDesk[NumX][NumY] = -2;
                        }
                    }
                }

                //=========================================================
                
                if (index2==-1) {//попадание по пустой ячейке
                    fDrawHit(1);
                    arMyDesk[NumX][NumY] = -3;
                    IsMiss = true;
                    //DW.innerHTML =DW.innerHTML + " Empty|" + NumX + "|" + NumY;
                } else if (index2 == -3 || index2 == -2) {//попадание по запрещенной или уже простреляной ячейке
                    IsMiss = false;
                    //DW.innerHTML = DW.innerHTML + " Forbidden|" + NumX + "|" + NumY;
                }
                else{
                    arMyShips[index2].Damage(context, NumX, NumY);//попадание в корабль
                    //+++++++++++++++++++++++++++++++++++++++++++++
                    if (arMyShips[index2].destroy != 0)//если попали и не убили, то нужно обстрелять соседние ячейки
                    {
                        IsInjury = true;
                        IsMiss = false;
                        //NumXInjury = NumX;//???
                        //NumYInjury = NumY;//???
                        IsInjuryCounter = 0;
                        arDamagedShip.unshift([NumX, NumY, IsInjuryCounter]);
                        //DW.innerHTML = DW.innerHTML + " Ship|" + NumX + "|" + NumY;
                    }
                    else {//попали и убили
                        IsInjury = false;
                        IsMiss = false;
                        IterCnt = 0;
                        //DW.innerHTML = DW.innerHTML + " Clear" + "|" + arDamagedShip.length;
                        
                        var arlen = arDamagedShip.length;
                        for (var i = 0; i < arlen; i++) {
                            arDamagedShip.shift();
                        }

                        gororvert = 0;
                        cntMyShipsDamaged += 1;
                        //DW.innerHTML = DW.innerHTML +"|" + IsInjury;
                        if (cntMyShipsDamaged == 10) {//Фиксируем победу противника
                            GameState = 4;
                            break;
                        }
                    }
                    //+++++++++++++++++++++++++++++++++++++++++++++
                    arMyDesk[NumX][NumY] = -3;
                }
                //Canvas2Img();// возвращаем холст в img
            } while (!IsMiss);

            //DW.innerHTML = DW.innerHTML +"|" +IterCnt;

            Canvas2Img(1);// возвращаем холст в img
            
            fimage2canvas(2);
            
            if (GameState == 4) {//обработка проигрыша
                YourTotalScore.innerText = Number(YourTotalScore.innerText) + 1;
                $('#youlose').dialog({
                    modal: true,
                    autoOpen: true,
                    buttons: {
                        "OK": function () {
                            $(this).dialog('close');
                        },
                    } // end buttons

                });

                updatedb();//+++ обновляем информаию об общем счете


                MSG.innerHTML = "Sorry, your ships are destroyed.";
                //fNewGamePrepare();
                StBut.innerHTML = "START";
                } else {
                    GameState = 2;
                }
            
            //++++++++++++++++++++++++++++++++++++++++++++++++++++
        } else if (index == -3) {//повторно в ячейку корабля
            $('#anothercell').dialog({
                modal: true,
                autoOpen: true,
                buttons: {
                    "OK": function () {
                        $(this).dialog('close');
                    },
                } // end buttons

            });
        }
        else{//попал в корабль противника
            arYourShips[index].Damage(contextback, NumX, NumY);
            if (arYourShips[index].destroy == 0) {
                cntYourShipsDamaged += 1;
            }
            if (cntYourShipsDamaged == 10) {//Фиксируем мобеду
                MyTotalScore.innerText = Number(MyTotalScore.innerText) + 1;
                MSG.innerHTML = "Greetings! You have destroyed all enemy ships.";
                $('#youwon').dialog({
                    modal: true,
                    autoOpen: true,
                    buttons: {
                        "OK": function () {
                            $(this).dialog('close');
                        },
                    } // end buttons

                });

                updatedb();//+++ обновляем информаию об общем счете

                //fNewGamePrepare();
                StBut.innerHTML = "START";
                GameState = 4;
            } 

                Canvas2Img(2);
                arYourDesk[NumX][NumY] = -3;
            
        }
        
        //++++++++++++++++++++++++++++++++++++++++++
    }
    //=================================
	

}

//=====================================
// Рисуем попадание по пустой ячейке
//=====================================
function fDrawHit(x) {
    var cntx;
    if (x == 1) {
        cntx = context;
    }
    if (x == 2) {
        cntx = contextback;
    }
    cntx.beginPath();
    cntx.lineWidth = 2;
    cntx.strokeStyle = cellcolor;
    cntx.moveTo(NumX * CellWidth + 1, NumY * CellWidth + 1);
    cntx.lineTo(NumX * CellWidth + CellWidth - 1, NumY * CellWidth + CellWidth - 1);
    cntx.moveTo(NumX * CellWidth + CellWidth - 1, NumY * CellWidth + 1);
    cntx.lineTo(NumX * CellWidth + 1, NumY * CellWidth + CellWidth - 1);
    cntx.stroke();
    cntx.closePath();
}


function getCoords(elem) {
    var box = elem.getBoundingClientRect();
    return {
        top: box.top+pageYOffset,
        left: box.left+pageXOffset
    }

}

function fLoadMiniDesk(x) {
    //MC.style.visibility = "hidden";
    //fimage2canvas(x);
}

function fLoadCanvas() {
    //MC.style.visibility = "visible";
}


//===================================
// Переносим холст в миниатюру
//===================================
function Canvas2Img(x) {
    
    if (x==1) {
        var data = MC.toDataURL("image/png");
        MDIMG.src = data;
    }
    if (x==2) {
        var data = MCB.toDataURL("image/png");
        YDIMG.src = data;
    }
}

//===================================
// Переносим миниатюру на хост
//===================================
function fimage2canvas(x) {

    if (x == 1) {
            MDIMG.className = "MyDesk SelectedDesk";
            YDIMG.className = "YourDesk UnSelectedDesk";
            MyDeskName.className = "SelectedHelp";
            YourDeskName.className = "Help";
            MC.style.zIndex = 2;
            MCB.style.zIndex = 1;
            CurState = 0;
    }

    if (x == 2) {

        YDIMG.className = "YourDesk SelectedDesk";
        MDIMG.className = "MyDesk UnSelectedDesk";
        YourDeskName.className = "SelectedHelp";
        MyDeskName.className = "Help";
        MCB.style.zIndex = "2";
        MC.style.zIndex = "1";
        CurState = 1;
    }
}

//================================================
// Нажатие кнопки начала игры
//================================================
function fStartGame() {
    fNewGamePrepare();
    if (GameState == 0 || GameState == 4) {//начало игры или конец игры
        // инициализирум табло
        YourCurScore.innerHTML = "0";
        MyCurScore.innerHTML = "0";
        // инициализирум переменные
        gororvert = 0;
        cntMyShipsDamaged = cntYourShipsDamaged = 0;
        StBut.innerHTML = "STOP";
        MSG.innerHTML = "";
        AudioEffect(2);
        MSG.innerHTML = "Select a place for your first four-cell ship and press NEXT or ROTATE.";
        CurShip = Ship(4);
        IsConfirmPos = 0;
        IsMiss = false;
        IsInjury = false;

        if (GameState == 0) {//начало новой игры
            for (var i = 0; i <= 9; i++) {
                arYourDesk[i] = new Array(10);
                for (var j = 0; j <= 9; j++)
                    arYourDesk[i][j] = -1;
            }
        for (var i = 0; i <= 9; i++) {
            arMyDesk[i] = new Array(10);
            for (var j = 0; j <= 9; j++)
                arMyDesk[i][j] = -1;
            }
        }

        if (GameState == 4) {//начало новой игры после проигрыша

            //чистим массивы от старой игры
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 9; j++)
                    arYourDesk[i][j] = -1;
            }
            for (var i = 0; i <= 9; i++) {
                for (var j = 0; j <= 9; j++)
                    arMyDesk[i][j] = -1;
            }

            
            arlen = arMyShips.length;
            for (var i = 0; i < arlen; i++) {
                arMyShips.shift();
            }

            arlen = arYourShips.length;
            for (var i = 0; i < arlen; i++) {
                arYourShips.shift();
            }

            //CurState = 1;
            fDraw(2);
            //CurState = 0;
            fDraw(1);
            
        }

        GameState = 1;
        fimage2canvas(1);
        

    }else {//завершение игры в процессе хода или расстановки кораблей
        GameState = 4;
        StBut.innerHTML = "START";
        NextBut.style.display = "None";
        RtBut.style.display = "None";
    }

    

    

}

//==================================================
// Подтверждение
//==================================================

function fConfirm() {

    if (CurState != 0) return;

    CurShip.Draw(true, context, arMyShips.length);
    Canvas2Img(1);
    arMyShips[arMyShips.length] = CurShip;
    if (arMyShips.length == 0) {
        AudioEffect(2);
        MSG.innerHTML = "Select a place for your first four-cell ship and press NEXT or ROTATE";
        CurShip = Ship(4);
        //NextBut.disabled = true;
    }    
    else if ((arMyShips.length > 0) && (arMyShips.length < 3)) {
        AudioEffect(2);
        MSG.innerHTML = "Select a place for your three-cell ship and press NEXT or ROTATE";
        CurShip = Ship(3);
        //NextBut.disabled = true;
    
    }
    else if ((arMyShips.length > 2) && (arMyShips.length < 6)) {
        AudioEffect(2);
        MSG.innerHTML = "Select a place for your two-cell ship and press NEXT or ROTATE";
        CurShip = Ship(2);
        //NextBut.disabled = true;

    }
    else if ((arMyShips.length > 5) && (arMyShips.length < 10)) {
        AudioEffect(2);
        MSG.innerHTML = "Select a place for your one-cell ship and press NEXT or ROTATE";
        CurShip = Ship(1);
        //NextBut.disabled = true;

    }
    else {
        AudioEffect(2);
        MSG.innerHTML = "All ships are ready. Let's start the battle.";
        IsConfirmPos = 1;
        //NextBut.disabled = true;
        NextBut.style.display = "None";
        //RtBut.disabled = true;
        RtBut.style.display = "None";
        fShowYourDesk();//отражаем доску противника
        fDrawYoursShips();
        fimage2canvas(2);
        GameState = 2;
    }

    //IsConfirmPos = 1;
    //NextBut.innerHTML = "NEXT";

}

function fRotate() {
    if (CurState != 0) return;
    CurShip.Clear(context);
    CurShip.Rotate(context);
    CurShip.Draw(false, context);
}

function fDrawYoursShips() {
    var index;

    for (i = 0; i <= 0; i++) {
        CurShip = YourShip(4);
        index = arYourShips.length;
        //oldi = -1;
        res = false;
        good:

            while (!res) {
                x = fgetRandomInRange(0, 9);
                y = fgetRandomInRange(0, 9);
                x1 = fgetRandomInRange(-1, 1);
                if (x1 == 1 || x1 == -1) {
                    y1 = 0;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
                if (x1 == 0) {
                    y1 = -1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                    y1 = 1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
            }
        arYourShips[index] = CurShip;
        if (res) CurShip.Draw(true, contextback, index);
    }

    for (i = 0; i <= 1; i++) {
        CurShip = YourShip(3);
        index = arYourShips.length;
        //oldi = -1;
        res = false;
        good:

            while (!res) {
                x = fgetRandomInRange(0, 9);
                y = fgetRandomInRange(0, 9);
                x1 = fgetRandomInRange(-1, 1);
                if (x1 == 1 || x1 == -1) {
                    y1 = 0;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
                if (x1 == 0) {
                    y1 = -1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                    y1 = 1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
            }
        arYourShips[index] = CurShip;
        if (res) CurShip.Draw(true, contextback, index);
    }

    for (i = 0; i <= 2; i++) {
        CurShip = YourShip(2);
        index = arYourShips.length;
        //oldi = -1;
        res = false;
        good:
            while (!res) {
                x = fgetRandomInRange(0, 9);
                y = fgetRandomInRange(0, 9);
                x1 = fgetRandomInRange(-1, 1);
                if (x1 == 1 || x1 == -1) {
                    y1 = 0;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
                if (x1 == 0) {
                    y1 = -1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                    y1 = 1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
            }
        arYourShips[index] = CurShip;
        if (res) CurShip.Draw(true, contextback, index);
    }

    for (i = 0; i <= 3; i++) {
        CurShip = YourShip(1);
        index = arYourShips.length;
        //oldi = -1;
        res = false;
        good:
            while (!res) {
                x = fgetRandomInRange(0, 9);
                y = fgetRandomInRange(0, 9);
                x1 = fgetRandomInRange(-1, 1);
                if (x1 == 1 || x1 == -1) {
                    y1 = 0;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
                if (x1 == 0) {
                    y1 = -1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                    y1 = 1;
                    res = CurShip.SetPos(contextback, x, y, x1, y1);
                    if (res) { break good };
                }
            }
        arYourShips[index] = CurShip;
        if (res) CurShip.Draw(true, contextback, index);
    }
}

function fgetRandomInRange(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function fNewGamePrepare() {
    arMyShips.length = 0;
    arYourShips.length = 0;
    arDamagedShip.length = 0;
}

function AudioEffect(v) {
    if (IsNoise.checked != true) return;
    if (v == 1) AudioFaraway.play();
    if (v == 2) AudioInterface.play();
}
