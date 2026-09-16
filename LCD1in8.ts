let GUI_BACKGROUND_COLOR = LCD_COLOR.WHITE
let FONT_BACKGROUND_COLOR = LCD_COLOR.WHITE
let FONT_FOREGROUND_COLOR = LCD_COLOR.BLACK

//% weight=20 color=#436EEE icon="\uf108"
namespace LCD1IN8 {
    //% blockId=LCD_Init
    //% blockGap=8
    //% block="LCD1IN8 Init"
    //% shim=LCD1IN8::LCD_Init
    //% weight=200
    export function LCD_Init(): void {
        return;
    }

    //% blockId=LCD_Clear
    //% blockGap=8
    //% block="Clear screen and cache"
    //% shim=LCD1IN8::LCD_Clear
    //% weight=195
    export function LCD_Clear(): void {
        return;
    }

    //% blockId=LCD_Filling
    //% blockGap=8
    //% block="Filling Color %Color"
    //% shim=LCD1IN8::LCD_Filling
    //% weight=194
    export function LCD_Filling(Color: number): void {
        return;
    }

    //% blockId=LCD_Display
    //% blockGap=8
    //% block="Send display data"
    //% shim=LCD1IN8::LCD_Display
    //% weight=190
    export function LCD_Display(): void {
        return;
    }

    //% blockId=LCD_DisplayWindows
    //% blockGap=8
    //% block="Show Windows display data |Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend "
    //% shim=LCD1IN8::LCD_DisplayWindows
    //% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
    //% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
    //% weight=189
    export function LCD_DisplayWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        return;
    }

    //% blockId=Get_Color
    //% blockGap=8
    //% block="%Color"
    //% weight=185
    export function Get_Color(Color: LCD_COLOR): number {
        return Color;
    }

    //% blockId=LCD_SetBL
    //% blockGap=8
    //% block="Set back light level %Lev"
    //% Lev.min=0 Lev.max=10
    //% shim=LCD1IN8::LCD_SetBL
    //% weight=180
    export function LCD_SetBL(Lev: number): void {
        return;
    }

    //% blockId=DrawPoint
    //% blockGap=8
    //% block="Draw Point|x %x|y %y|Color %Color|Point Size %Dot"
    //% x.min=1 x.max=160 y.min=1 y.max=128
    //% Color.min=0 Color.max=65535
    //% shim=LCD1IN8::DrawPoint
    //% weight=150
    export function DrawPoint(x: number, y: number, Color: number, Dot: DOT_PIXEL): void {
        return;
    }

    //% shim=LCD1IN8::DrawHLine
    function DrawHLine(Xstart: number, Xend: number, Y: number, Color: number, Dot: DOT_PIXEL): void {
        return;
    }

    //% blockId=DrawLine
    //% blockGap=8
    //% block="Draw Line|Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend|Color %Color|Line width %Line_width|Line Style %Line_Style"
    //% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
    //% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
    //% Color.min=0 Color.max=65535
    //% weight=140
    export function DrawLine(Xstart: number, Ystart: number, Xend: number, Yend: number, Color: number, Line_width: DOT_PIXEL, Line_Style: LINE_STYLE): void {
        let Xpoint = Xstart;
        let Ypoint = Ystart;
        const dx = Xend - Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
        const dy = Yend - Ystart <= 0 ? Yend - Ystart : Ystart - Yend;
        const XAddway = Xstart < Xend ? 1 : -1;
        const YAddway = Ystart < Yend ? 1 : -1;

        let Esp = dx + dy;
        let Line_Style_Temp = 0;

        for (; ;) {
            Line_Style_Temp++;
            if (Line_Style == LINE_STYLE.LINE_DOTTED && Line_Style_Temp % 3 == 0) {
                DrawPoint(Xpoint, Ypoint, GUI_BACKGROUND_COLOR, Line_width);
                Line_Style_Temp = 0;
            } else {
                DrawPoint(Xpoint, Ypoint, Color, Line_width);
            }

            if (2 * Esp >= dy) {
                if (Xpoint == Xend) break;
                Esp += dy;
                Xpoint += XAddway;
            }
            if (2 * Esp <= dx) {
                if (Ypoint == Yend) break;
                Esp += dx;
                Ypoint += YAddway;
            }
        }
    }

    //% blockId=DrawRectangle
    //% blockGap=8
    //% block="Draw Rectangle|Xstart2 %Xstart2|Ystart2 %Ystart2|Xend2 %Xend2|Yend2 %Yend2|Color %Color|Filled %Filled |Line width %Dot_Pixel"
    //% Xstart2.min=1 Xstart2.max=160 Ystart2.min=1 Ystart2.max=128
    //% Xend2.min=1 Xend2.max=160 Yend2.min=1 Yend2.max=128
    //% Color.min=0 Color.max=65535
    //% weight=130
    export function DrawRectangle(Xstart2: number, Ystart2: number, Xend2: number, Yend2: number, Color: number, Filled: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        if (Xstart2 > Xend2) {
            const t = Xstart2;
            Xstart2 = Xend2;
            Xend2 = t;
        }
        if (Ystart2 > Yend2) {
            const t = Ystart2;
            Ystart2 = Yend2;
            Yend2 = t;
        }

        if (Filled == DRAW_FILL.DRAW_FULL) {
            for (let y = Ystart2; y < Yend2; y++) {
                DrawHLine(Xstart2, Xend2, y, Color, Dot_Pixel);
            }
        } else {
            DrawHLine(Xstart2, Xend2, Ystart2, Color, Dot_Pixel);
            DrawHLine(Xstart2, Xend2, Yend2, Color, Dot_Pixel);
            DrawLine(Xstart2, Ystart2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
        }
    }

    //% blockId=DrawCircle
    //% blockGap=8
    //% block="Draw Circle|X_Center %X_Center|Y_Center %Y_Center|Radius %Radius|Color %Color|Filled %Draw_Fill|Line width %Dot_Pixel"
    //% X_Center.min=1 X_Center.max=160 Y_Center.min=1 Y_Center.max=128
    //% Radius.min=0 Radius.max=160
    //% Color.min=0 Color.max=65535
    //% weight=120
    export function DrawCircle(X_Center: number, Y_Center: number, Radius: number, Color: number, Draw_Fill: DRAW_FILL, Dot_Pixel: DOT_PIXEL): void {
        let XCurrent = 0;
        let YCurrent = Radius;
        let Esp = 3 - (Radius << 1);

        if (Draw_Fill == DRAW_FILL.DRAW_FULL) {
            while (XCurrent <= YCurrent) {
                for (let sCountY = XCurrent; sCountY <= YCurrent; sCountY++) {
                    DrawPoint(X_Center + XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center - XCurrent, Y_Center + sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center - sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center - sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center - XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center + XCurrent, Y_Center - sCountY, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center + sCountY, Y_Center - XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                    DrawPoint(X_Center + sCountY, Y_Center + XCurrent, Color, DOT_PIXEL.DOT_PIXEL_1);
                }

                if (Esp < 0) {
                    Esp += 4 * XCurrent + 6;
                } else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        } else {
            while (XCurrent <= YCurrent) {
                DrawPoint(X_Center + XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center - XCurrent, Y_Center + YCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center - YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center - YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center - XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center + XCurrent, Y_Center - YCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center + YCurrent, Y_Center - XCurrent, Color, Dot_Pixel);
                DrawPoint(X_Center + YCurrent, Y_Center + XCurrent, Color, Dot_Pixel);

                if (Esp < 0) {
                    Esp += 4 * XCurrent + 6;
                } else {
                    Esp += 10 + 4 * (XCurrent - YCurrent);
                    YCurrent--;
                }
                XCurrent++;
            }
        }
    }

    //% shim=LCD1IN8::DisChar_1207
    function DisChar_1207(Xchar: number, Ychar: number, Char_Offset: number, Color: number): void {
        return;
    }

    //% blockId=DisString
    //% blockGap=8
    //% block="Show String|X %Xchar|Y %Ychar|char %ch|Color %Color"
    //% Xchar.min=1 Xchar.max=160 Ychar.min=1 Ychar.max=128
    //% Color.min=0 Color.max=65535
    //% weight=100
    export function DisString(Xchar: number, Ychar: number, ch: string, Color: number): void {
        let Xpoint = Xchar;
        let Ypoint = Ychar;
        const Font_Height = 12;
        const Font_Width = 7;

        for (let i = 0; i < ch.length; i++) {
            const ch_asicc = ch.charCodeAt(i) - 32;
            const Char_Offset = ch_asicc * Font_Height;

            if (ch_asicc >= 0 && ch_asicc < 95) {
                if ((Xpoint + Font_Width) > 160) {
                    Xpoint = Xchar;
                    Ypoint += Font_Height;
                }

                if ((Ypoint + Font_Height) > 128) {
                    Xpoint = Xchar;
                    Ypoint = Ychar;
                }

                DisChar_1207(Xpoint, Ypoint, Char_Offset, Color);
                Xpoint += Font_Width;
            }
        }
    }

    //% blockId=DisNumber
    //% blockGap=8
    //% block="Show number|X %Xnum|Y %Ynum|number %num|Color %Color"
    //% Xnum.min=1 Xnum.max=160 Ynum.min=1 Ynum.max=128
    //% Color.min=0 Color.max=65535
    //% weight=100
    export function DisNumber(Xnum: number, Ynum: number, num: number, Color: number): void {
        DisString(Xnum, Ynum, num + "", Color);
    }
}
