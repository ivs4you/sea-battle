


function Ship(cell) {
    var ship = {
        type: cell, x: -1, y: -1, x1: 1, y1: 0, destroy: cell,
        SetPos: function (cntxt,numx, numy) {
            for (var i = this.type; i >= 1; i--) {
                if (!RotateControl(cntxt,numx + this.x1 * (this.type - i), numy + this.y1 * (this.type - i))) {
                    return (false);
                }
            }
            this.x = numx;
            this.y = numy;
            //this.x1 = numx + 1;
            //this.y1 = numy;
            return (true);
        },
        Draw: function (isconfirm, cntxt, index) {

            var shipgrad;// = cntxt.createLinearGradient(this.x * CellWidth, this.y * CellWidth, this.x * CellWidth + CellWidth, this.y * CellWidth + CellWidth);
 
            
            for (var i = this.type; i >= 1; i--) {
   
                if (this.destroy != 0) {
                    if (isconfirm) {
                        RestrictedAreaControl(i, cntxt, this.x, this.y, this.x1, this.y1, this.type);
                        arMyDesk[this.x + this.x1 * (this.type - i)][this.y + this.y1 * (this.type - i)] = index;
                        shipgrad = shipcolor;
                    } else {
                        //shipgrad.addColorStop(0, "blue");
                        //shipgrad.addColorStop(1, "white");
                        shipgrad = projectcolor;
                    }
                    cntxt.fillStyle = shipgrad;
                    cntxt.fillRect((this.x + this.x1 * (this.type - i)) * CellWidth + 1, (this.y + this.y1 * (this.type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
                }
                else {
                    cntxt.fillStyle = "rgb(" + destroycolor[0] + "," + destroycolor[1] + "," + destroycolor[2] +")";
                    cntxt.fillRect((this.x + this.x1 * (this.type - i)) * CellWidth + 1, (this.y + this.y1 * (this.type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
                }
            }
            Canvas2Img();
        },
        Clear: function (cntxt) {//чистим место, где стоял корабль
            if (this.x == -1) {
                return;
            }
           //if (CurState == 0) {
            cntxt.fillStyle = mydesccolor;//"#1E90FF";
            //}
            //else {
            //    cntxt.fillStyle = "#87CEFA";
            //}
            for (var i = this.type; i >= 1; i--) {


                cntxt.fillRect((this.x + this.x1 * (this.type - i)) * CellWidth + 1, (this.y + this.y1 * (this.type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            }
            Canvas2Img();
        },
        Rotate: function (cntxt) {
            if (this.y1 == 0) {

                if (this.x1 == 1) {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x, this.y + i)) {
                            return (false);
                        }
                    }
                    this.x1 = 0;
                    this.y1 = 1;
                } else {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x, this.y - i)) {
                            return (false);
                        }
                    }
                    this.x1 = 0;
                    this.y1 = -1;
                }

                return (true);
            }

            if (this.x1 == 0) {

                if (this.y1 == 1) {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x - i, this.y)) {
                            return (false);
                        }
                    }
                    this.x1 = -1;
                    this.y1 = 0;
                } else {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x + i, this.y)) {
                            return (false);
                        }
                    }
                    this.x1 = 1;
                    this.y1 = 0;
                }

                return (true);
            }
        },
        Damage: function (cntxt, numx, numy) {
        this.destroy -= 1;
        if (this.destroy == 0) {
            YourCurScore.innerText = Number(YourCurScore.innerText) + 1;
            AudioEffect(1);
            this.Draw(false,cntxt,0);
            return;
        }

            //var shipgrad = cntxt.createRadialGradient(numx * CellWidth + CellWidth / 2, numy * CellWidth + CellWidth / 2, 0, numx * CellWidth + CellWidth / 2, numy * CellWidth + CellWidth / 2, CellWidth / 2);
            //shipgrad.addColorStop(0, "red");
            //shipgrad.addColorStop(1, shipcolor);

        //cntxt.fillStyle = shipcolor;
        //cntxt.fillRect(numx * CellWidth + 1, numy * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            //cntxt.fillStyle = "red";
            //cntxt.arc(numx * CellWidth + CellWidth / 2, numy * CellWidth + CellWidth / 2, (CellWidth-2) / 4, 0, 2 * Math.PI);
            //cntxt.closePath();
            //cntxt.fill();

            //cntxt.stroke();
        cntxt.beginPath();
        cntxt.moveTo(numx * CellWidth + 1, numy * CellWidth + 1);
        cntxt.lineTo(numx * CellWidth + CellWidth - 1, numy * CellWidth + CellWidth - 1);
        cntxt.moveTo(numx * CellWidth + CellWidth - 1, numy * CellWidth + 1);
        cntxt.lineTo(numx * CellWidth + 1, numy * CellWidth + CellWidth - 1);
        cntxt.lineWidth = 2;
        cntxt.strokeStyle = "yellow";
        cntxt.stroke();
        cntxt.closePath();
    }
    };
    //ship.Draw(false);
    return (ship);

}

function YourShip(cell) {
    var ship = {
        type: cell, x: -1, y: -1, x1: 0, y1: 0,destroy:cell,
        SetPos: function (cntxt, numx, numy, dirx, diry) {
            for (var i = this.type; i >= 1; i--) {
                if (!YourRotateControl(cntxt, numx + dirx * (this.type - i), numy + diry * (this.type - i))) {
                    return (false);
                }
            }
            this.x = numx;
            this.y = numy;
            this.x1 = dirx;
            this.y1 = diry;
            return (true);
        },
        Draw: function (isconfirm, cntxt, index) {

            var shipgrad;// = cntxt.createLinearGradient(this.x * CellWidth, this.y * CellWidth, this.x * CellWidth + CellWidth, this.y * CellWidth + CellWidth);


            for (var i = this.type; i >= 1; i--) {


                if (isconfirm) {
                    YourRestrictedAreaControl(i, this.x, this.y, this.x1, this.y1, this.type);
                    arYourDesk[this.x + this.x1 * (this.type - i)][ this.y + this.y1 * (this.type - i)] = index;
                }
                //else {
                    //shipgrad.addColorStop(0, "blue");
                    //shipgrad.addColorStop(1, "white");
                //    shipgrad = "cyan";
                //}
                //+++++ В реальной игре отрисовывать корабли противника не нужно ++++++++++++++
                if (this.destroy == 0) {
                    cntxt.fillStyle = "rgb(" + destroycolor[0] + "," + destroycolor[1] + "," + destroycolor[2] + ")";
                    cntxt.fillRect((this.x + this.x1 * (this.type - i)) * CellWidth + 1, (this.y + this.y1 * (this.type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
                }
                    //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

            }
            Canvas2Img();
        },
        Clear: function (cntxt) {
            if (this.x == -1) {
                return;
            }
            //if (CurState == 0) {
                cntxt.fillStyle = yourdesccolor;//"#1E90FF";
            //}
            //else {
            //    cntxt.fillStyle = "#87CEFA";
            //}
            for (var i = this.type; i >= 1; i--) {


                cntxt.fillRect((this.x + this.x1 * (this.type - i)) * CellWidth + 1, (this.y + this.y1 * (this.type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            }
            Canvas2Img();
        },
        Rotate: function (cntxt) {
            if (this.y1 == 0) {

                if (this.x1 == 1) {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x, this.y + i)) {
                            return (false);
                        }
                    }
                    this.x1 = 0;
                    this.y1 = 1;
                } else {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x, this.y - i)) {
                            return (false);
                        }
                    }
                    this.x1 = 0;
                    this.y1 = -1;
                }

                return (true);
            }

            if (this.x1 == 0) {

                if (this.y1 == 1) {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x - i, this.y)) {
                            return (false);
                        }
                    }
                    this.x1 = -1;
                    this.y1 = 0;
                } else {
                    for (var i = 1; i <= this.type - 1; i++) {
                        if (!RotateControl(cntxt, this.x + i, this.y)) {
                            return (false);
                        }
                    }
                    this.x1 = 1;
                    this.y1 = 0;
                }

                return (true);
            }
        },
        Damage: function (cntxt, numx, numy) {
            this.destroy -= 1;
            if (this.destroy == 0) {
                MyCurScore.innerText = Number(MyCurScore.innerText) + 1;
                AudioEffect(1);
                this.Draw(false, cntxt, 0);
                return;
            }

            //var shipgrad = cntxt.createRadialGradient(numx * CellWidth + CellWidth / 2, numy * CellWidth + CellWidth / 2, 0, numx * CellWidth + CellWidth / 2, numy * CellWidth + CellWidth / 2, CellWidth / 2);
            //shipgrad.addColorStop(0, "red");
            //shipgrad.addColorStop(1, shipcolor);

            cntxt.fillStyle = shipcolor;
            cntxt.fillRect(numx * CellWidth + 1, numy * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            //cntxt.fillStyle = "red";
            //cntxt.arc(numx * CellWidth + CellWidth / 2, numy * CellWidth + CellWidth / 2, (CellWidth-2) / 4, 0, 2 * Math.PI);
            //cntxt.closePath();
            //cntxt.fill();

            //cntxt.stroke();
            cntxt.beginPath();
            cntxt.moveTo(numx * CellWidth + 1, numy * CellWidth + 1);
            cntxt.lineTo(numx * CellWidth + CellWidth - 1, numy * CellWidth + CellWidth - 1);
            cntxt.moveTo(numx * CellWidth + CellWidth - 1, numy * CellWidth + 1);
            cntxt.lineTo(numx * CellWidth + 1, numy * CellWidth + CellWidth - 1);
            cntxt.lineWidth = 2;
            cntxt.strokeStyle = "yellow";
            cntxt.stroke();
            cntxt.closePath();
    }
    };
    //ship.Draw(false);
    return (ship);

}

function RotateControl(cntxt, x, y) {
    var coordx = x * CellWidth + CellWidth/2;
    var coordy = y * CellWidth + CellWidth/2;
    var imdData = cntxt.getImageData(coordx, coordy, 1, 1);
    var pixels = imdData.data;
    var red = pixels[0];
    var green = pixels[1];
    var blue = pixels[2];
    var alpha = pixels[3];

    //проверка на цвет чистой ячейки
    if ((red == mdesccolor[0] && green == mdesccolor[1] && blue == mdesccolor[2] && alpha == 255)) {
        return (true);
    } else {
        return (false);
    }

}

function YourRotateControl(cntxt, x, y) {
    if ((x > 9) || (y > 9)) {//проверка выхода за границы игрового поля
        return false;
    }
    if ((x < 0) || (y < 0)) {//проверка выхода за границы игрового поля
        return false;
    }
    if (arYourDesk[x][ y] != -1) {
        return false; //проверка свободной ячейки
    }
    //-------------------------------------------------------------------------
    //var coordx = x * CellWidth + CellWidth / 2;
    //var coordy = y * CellWidth + CellWidth / 2;
    //var imdData = cntxt.getImageData(coordx, coordy, 1, 1);
    //var pixels = imdData.data;
    //var red = pixels[0];
    //var green = pixels[1];
    //var blue = pixels[2];
    //var alpha = pixels[3];

    //if ((red == 135 && green == 206 && blue == 250 && alpha == 255)) {
    //    return (true);
    //} else {
    //    return (false);
    //}
    return true;
}

function RestrictedAreaControl(i,cntxt,x,y,x1,y1,type)
{
    //+++++++++++++++++++++++++++++++++++++++++
    cntxt.fillStyle = restrictedarea;
    if (i == 1) {//рисуем границы вокруг дальнего конца
        //cntxt.fillStyle = "red";
        if (x1 != 0) {//для горизонтального расположения

            cntxt.fillRect((x + x1 * (type - i + 1)) * CellWidth + 1, (y + y1 * (type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x + x1 * (type - i + 1)) * CellWidth + 1, (y - 1) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x + x1 * (type - i + 1)) * CellWidth + 1, (y + 1) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
        }
        if (y1 != 0) {//для вертикального расположения
            cntxt.fillRect((x + x1 * (type - i)) * CellWidth + 1, (y + y1 * (type - i + 1)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x - 1) * CellWidth + 1, (y + y1 * (type - i + 1)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x + 1) * CellWidth + 1, (y + y1 * (type - i + 1)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
        }

    }
    if (i == type) {//рисуем границы вокруг ближнего конца
        //cntxt.fillStyle = "yellow";
        if (x1 != 0) {//для горизонтального расположения
            cntxt.fillRect((x + x1 * (type - i - 1)) * CellWidth + 1, (y + y1 * (type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x + x1 * (type - i - 1)) * CellWidth + 1, (y - 1) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x + x1 * (type - i - 1)) * CellWidth + 1, (y + 1) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
        }
        if (y1 != 0) {//для вертикального расположения
            cntxt.fillRect((x + x1 * (type - i)) * CellWidth + 1, (y + y1 * (type - i - 1)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x - 1) * CellWidth + 1, (y + y1 * (type - i - 1)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
            cntxt.fillRect((x + 1) * CellWidth + 1, (y + y1 * (type - i - 1)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
        }

    }
    if (x1 != 0) {//для горизонтального расположения
        //cntxt.fillStyle = "blue";
        cntxt.fillRect((x + x1 * (type - i)) * CellWidth + 1, (y - 1) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
        cntxt.fillRect((x + x1 * (type - i)) * CellWidth + 1, (y + 1) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
    }
    if (y1 != 0) {//для вертикального расположения
        //cntxt.fillStyle = "green";
        cntxt.fillRect((x - 1) * CellWidth + 1, (y + y1 * (type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
        cntxt.fillRect((x + 1) * CellWidth + 1, (y + y1 * (type - i)) * CellWidth + 1, CellWidth - 2, CellWidth - 2);
    }
    //+++++++++++++++++++++++++++++++++++++++++
}

function YourRestrictedAreaControl(i, x, y, x1, y1, type) {
    //+++++++++++++++++++++++++++++++++++++++++
    if (i == 1) {//рисуем границы вокруг дальнего конца

        if (x1 != 0) {//для горизонтального расположения
            try{arYourDesk[x + x1 * (type - i + 1)][ y + y1 * (type - i)]=-2;}catch (e) {}
            try{arYourDesk[x + x1 * (type - i + 1)][y - 1] = -2;}catch (e) {}
            try { arYourDesk[x + x1 * (type - i + 1)][y + 1] = -2; } catch (e) { }
        }
        if (y1 != 0) {//для вертикального расположения
            try{arYourDesk[x + x1 * (type - i)][ y + y1 * (type - i + 1)]=-2;}catch (e) {}
            try{arYourDesk[x - 1][ y + y1 * (type - i + 1)]=-2;}catch (e) {}
            try { arYourDesk[x + 1][y + y1 * (type - i + 1)] = -2; } catch (e) { }
        }

    }
    if (i == type) {//рисуем границы вокруг ближнего конца

        if (x1 != 0) {//для горизонтального расположения
            try{arYourDesk[x + x1 * (type - i - 1)][ y + y1 * (type - i)]=-2;}catch (e) { }
            try{arYourDesk[x + x1 * (type - i - 1)][ y - 1]=-2;}catch (e) { }
            try { arYourDesk[x + x1 * (type - i - 1)][y + 1] = -2; }catch (e) { }
        }
        if (y1 != 0) {//для вертикального расположения
            try{arYourDesk[x + x1 * (type - i)][ y + y1 * (type - i - 1)]=-2;}catch (e) {}
            try{arYourDesk[x - 1][ y + y1 * (type - i - 1)]=-2;}catch (e) {}
            try{arYourDesk[x + 1][ y + y1 * (type - i - 1)]=-2;}catch (e) {}
        }

    }
    if (x1 != 0) {//для горизонтального расположения
        try{arYourDesk[x + x1 * (type - i)][ y - 1]=-2;}catch (e) {}
        try{arYourDesk[x + x1 * (type - i)][ y + 1]=-2;}catch (e) {}
    }
    if (y1 != 0) {//для вертикального расположения
        try{arYourDesk[x - 1][ y + y1 * (type - i)]=-2;}catch (e) {}
        try { arYourDesk[x + 1][y + y1 * (type - i)] = -2; } catch (e) { }
    }
    ////+++++++++++++++++++++++++++++++++++++++++
}