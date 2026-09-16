let GUI_BACKGROUND_COLOR = LCD_COLOR.WHITE
let FONT_BACKGROUND_COLOR = LCD_COLOR.WHITE
let FONT_FOREGROUND_COLOR = LCD_COLOR.BLACK

const LCD_WIDTH = 160
const LCD_HEIGHT = 128

// 23LC1024 SRAM opcodes
const SRAM_CMD_WREN = 0x06
const SRAM_CMD_WRDI = 0x04
const SRAM_CMD_RDSR = 0x05
const SRAM_CMD_WRSR = 0x01
const SRAM_CMD_READ = 0x03
const SRAM_CMD_WRITE = 0x02

// 23LC1024 SRAM modes
const SRAM_BYTE_MODE = 0x00
const SRAM_PAGE_MODE = 0x80
const SRAM_STREAM_MODE = 0x40

const Font12_Table = hex`000000000000000000000000001010101010000010000000006C48480000000000000000001414287C287C2850500000001038404038487010100000002050200C7008140800000000000018202054483400000000101010100000000000000000080810101010101008080000202010101010101020200000107C1028280000000000000000101010FE10101000000000000000000000181030200000000000007C00000000000000000000000000303000000000040408081010202040000000384444444444443800000000301010101010107C00000000384404081020447C000000003844041804044438000000000C141424447E040E000000003C20203804044438000000001C20407844444438000000007C4404080808101000000000384444384444443800000000384444443C04087000000000000030300000303000000000000018180000183020000000000C10608060100C000000000000007C007C00000000000000C02018041820C00000000000182404081000300000003844444C54544C40443800000030102828287C44EE00000000F8444478444444F8000000003C4440404040443800000000F0484444444448F000000000FC445070504044FC000000007E22283828202070000000003C4440404E44443800000000EE44447C444444EE000000007C1010101010107C000000003C0808084848483000000000EE444850704844E600000000702020202024247C00000000EE6C6C54544444EE00000000EE64645454544CEC0000000038444444444444380000000078242424382020700000000038444444444444381C000000F8444444784844E200000000344C40380404645800000000FE9210101010103800000000EE4444444444443800000000EE4444282828101000000000EE4444545454542800000000C6442810102844C600000000EE44282810101038000000007C4408101020447C0000000038202020202020202038000040202020101008080800000038080808080808080838000010102844000000000000000000000000000000000000FE00100800000000000000000000000038443C44443E00000000C0405864444444F80000000000003C4440404438000000000C04344C4444443E00000000000038447C40403C000000001C207C202020207C000000000000364C4444443C04380000C0405864444444EE00000000100070101010107C00000000100078080808080808700000C0405C48705048DC00000000301010101010107C000000000000E854545454FE000000000000D864444444EE000000000000384444444438000000000000D8644444447840E000000000364C4444443C040E000000006C302020207C0000000000003C44380444780000000000207C202020221C000000000000CC4444444C36000000000000EE4444282810000000000000EE4454545428000000000000CC48303048CC000000000000EE44242818101078000000007C481020447C000000000810101010201010100800001010101010101010100000002010101010081010102000000000000024580000000000`;

pins.spiPins(DigitalPin.P15, DigitalPin.P14, DigitalPin.P13)
pins.spiFormat(8, 0)
pins.spiFrequency(8000000)
pins.digitalWritePin(DigitalPin.P2, 1)
pins.digitalWritePin(DigitalPin.P16, 1)

//% weight=20 color=#436EEE icon="\uf108"
namespace LCD1IN8 {
    function Swop_AB(Point1: number, Point2: number): void {
        let Temp = 0;
        Temp = Point1;
        Point1 = Point2;
        Point2 = Temp;
    }

    function LCD_WriteReg(Reg: number): void {
        pins.digitalWritePin(DigitalPin.P12, 0);
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(Reg);
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_WriteData_8Bit(Data: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1);
        pins.digitalWritePin(DigitalPin.P16, 0);
        pins.spiWrite(Data);
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_WriteData_Buf(Buf: number, Len: number): void {
        pins.digitalWritePin(DigitalPin.P12, 1);
        pins.digitalWritePin(DigitalPin.P16, 0);
        for (let i = 0; i < Len; i++) {
            pins.spiWrite((Buf >> 8) & 0xff);
            pins.spiWrite(Buf & 0xff);
        }
        pins.digitalWritePin(DigitalPin.P16, 1);
    }

    function LCD_SetWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        // Set the X coordinates.
        LCD_WriteReg(0x2A);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Xstart & 0xff) + 1);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(((Xend - 1) & 0xff) + 1);

        // Set the Y coordinates.
        LCD_WriteReg(0x2B);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit((Ystart & 0xff) + 2);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(((Yend - 1) & 0xff) + 2);

        LCD_WriteReg(0x2C);
    }

    function LCD_SetColor(Color: number, Xpoint: number, Ypoint: number): void {
        LCD_WriteData_Buf(Color, Xpoint * Ypoint);
    }

    function LCD_ClearScreen(Color: number): void {
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
        LCD_SetColor(Color, LCD_WIDTH + 2, LCD_HEIGHT + 2);
    }

    function LCD_ClearBuf(Color: number = LCD_COLOR.WHITE): void {
        const hi = (Color >> 8) & 0xff;
        const lo = Color & 0xff;

        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRITE);
        pins.spiWrite(0x00);
        pins.spiWrite(0x00);
        pins.spiWrite(0x00);

        for (let i = 0; i < LCD_WIDTH * LCD_HEIGHT; i++) {
            pins.spiWrite(hi);
            pins.spiWrite(lo);
        }

        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function LCD_SetPoint(Xpoint: number, Ypoint: number, Color: number): void {
        const Addr = (Xpoint + Ypoint * LCD_WIDTH) * 2;
        SPIRAM_WR_Byte(Addr, (Color >> 8) & 0xff);
        SPIRAM_WR_Byte(Addr + 1, Color & 0xff);
    }

    function SPIRAM_Set_Mode(mode: number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRSR);
        pins.spiWrite(mode);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function SPIRAM_RD_Byte(Addr: number): number {
        let RD_Byte = 0;
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_READ);
        pins.spiWrite(0x00);
        pins.spiWrite((Addr >> 8) & 0xff);
        pins.spiWrite(Addr & 0xff);
        RD_Byte = pins.spiWrite(0x00);
        pins.digitalWritePin(DigitalPin.P2, 1);
        return RD_Byte;
    }

    function SPIRAM_WR_Byte(Addr: number, Data: number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_WRITE);
        pins.spiWrite(0x00);
        pins.spiWrite((Addr >> 8) & 0xff);
        pins.spiWrite(Addr & 0xff);
        pins.spiWrite(Data & 0xff);
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    function SPIRAM_RD_Stream(Addr: number, buf: number[], Len: number): void {
        pins.digitalWritePin(DigitalPin.P2, 0);
        pins.spiWrite(SRAM_CMD_READ);
        pins.spiWrite(0x00);
        pins.spiWrite((Addr >> 8) & 0xff);
        pins.spiWrite(Addr & 0xff);
        for (let i = 0; i < Len; i++) {
            buf[i] = pins.spiWrite(0x00);
        }
        pins.digitalWritePin(DigitalPin.P2, 1);
    }

    //% blockId=LCD_Init
    //% blockGap=8
    //% block="LCD1IN8 Init"
    //% weight=200
    export function LCD_Init(): void {
        pins.digitalWritePin(DigitalPin.P8, 1);
        basic.pause(100);
        pins.digitalWritePin(DigitalPin.P8, 0);
        basic.pause(100);
        pins.digitalWritePin(DigitalPin.P8, 1);
        basic.pause(100);

        pins.digitalWritePin(DigitalPin.P2, 1);
        pins.digitalWritePin(DigitalPin.P16, 1);
        pins.analogWritePin(AnalogPin.P1, 1023);

        // ST7735R frame rate.
        LCD_WriteReg(0xB1);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB2);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        LCD_WriteReg(0xB3);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);
        LCD_WriteData_8Bit(0x01);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x2D);

        // Column inversion.
        LCD_WriteReg(0xB4);
        LCD_WriteData_8Bit(0x07);

        // ST7735R power sequence.
        LCD_WriteReg(0xC0);
        LCD_WriteData_8Bit(0xA2);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x84);
        LCD_WriteReg(0xC1);
        LCD_WriteData_8Bit(0xC5);

        LCD_WriteReg(0xC2);
        LCD_WriteData_8Bit(0x0A);
        LCD_WriteData_8Bit(0x00);

        LCD_WriteReg(0xC3);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0x2A);
        LCD_WriteReg(0xC4);
        LCD_WriteData_8Bit(0x8A);
        LCD_WriteData_8Bit(0xEE);

        // VCOM.
        LCD_WriteReg(0xC5);
        LCD_WriteData_8Bit(0x0E);

        // ST7735R gamma sequence.
        LCD_WriteReg(0xE0);
        LCD_WriteData_8Bit(0x0F);
        LCD_WriteData_8Bit(0x1A);
        LCD_WriteData_8Bit(0x0F);
        LCD_WriteData_8Bit(0x18);
        LCD_WriteData_8Bit(0x2F);
        LCD_WriteData_8Bit(0x28);
        LCD_WriteData_8Bit(0x20);
        LCD_WriteData_8Bit(0x22);
        LCD_WriteData_8Bit(0x1F);
        LCD_WriteData_8Bit(0x1B);
        LCD_WriteData_8Bit(0x23);
        LCD_WriteData_8Bit(0x37);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x02);
        LCD_WriteData_8Bit(0x10);

        LCD_WriteReg(0xE1);
        LCD_WriteData_8Bit(0x0F);
        LCD_WriteData_8Bit(0x1B);
        LCD_WriteData_8Bit(0x0F);
        LCD_WriteData_8Bit(0x17);
        LCD_WriteData_8Bit(0x33);
        LCD_WriteData_8Bit(0x2C);
        LCD_WriteData_8Bit(0x29);
        LCD_WriteData_8Bit(0x2E);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x30);
        LCD_WriteData_8Bit(0x39);
        LCD_WriteData_8Bit(0x3F);
        LCD_WriteData_8Bit(0x00);
        LCD_WriteData_8Bit(0x07);
        LCD_WriteData_8Bit(0x03);
        LCD_WriteData_8Bit(0x10);

        // Enable test command.
        LCD_WriteReg(0xF0);
        LCD_WriteData_8Bit(0x01);

        // Disable RAM power save mode.
        LCD_WriteReg(0xF6);
        LCD_WriteData_8Bit(0x00);

        // 65K color mode.
        LCD_WriteReg(0x3A);
        LCD_WriteData_8Bit(0x05);

        // MX, MY, RGB mode.
        LCD_WriteReg(0x36);
        LCD_WriteData_8Bit(0xF7 & 0xA0);

        // Sleep out and display on.
        LCD_WriteReg(0x11);
        basic.pause(120);
        LCD_WriteReg(0x29);

        SPIRAM_Set_Mode(SRAM_BYTE_MODE);
    }

    //% blockId=LCD_Clear
    //% blockGap=8
    //% block="Clear screen and cache"
    //% weight=195
    export function LCD_Clear(): void {
        LCD_ClearScreen(LCD_COLOR.WHITE);
        LCD_ClearBuf(LCD_COLOR.WHITE);
    }

    //% blockId=LCD_Filling
    //% blockGap=8
    //% block="Filling Color %Color"
    //% weight=194
    export function LCD_Filling(Color: number): void {
        LCD_ClearScreen(Color);
    }

    //% blockId=LCD_Display
    //% blockGap=8
    //% block="Send display data"
    //% weight=190
    export function LCD_Display(): void {
        const chunkBytes = LCD_WIDTH * 2 * 2;
        const rbuf: number[] = [];
        for (let i = 0; i < chunkBytes; i++) {
            rbuf.push(0);
        }

        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);

        for (let y = 0; y < LCD_HEIGHT / 2; y++) {
            SPIRAM_RD_Stream(y * chunkBytes, rbuf, chunkBytes);

            pins.digitalWritePin(DigitalPin.P12, 1);
            pins.digitalWritePin(DigitalPin.P16, 0);
            for (let i = 0; i < chunkBytes; i++) {
                pins.spiWrite(rbuf[i]);
            }
            pins.digitalWritePin(DigitalPin.P16, 1);
        }

        // Make sure the panel remains enabled.
        LCD_WriteReg(0x29);
    }

    //% blockId=LCD_DisplayWindows
    //% blockGap=8
    //% block="Show Windows display data |Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend "
    //% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
    //% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
    //% weight=189
    export function LCD_DisplayWindows(Xstart: number, Ystart: number, Xend: number, Yend: number): void {
        const pixels = Math.max(0, Xend - Xstart);
        const readBytes = (pixels + 1) * 2;
        const rbuf: number[] = [];
        for (let i = 0; i < readBytes; i++) {
            rbuf.push(0);
        }

        SPIRAM_Set_Mode(SRAM_STREAM_MODE);
        LCD_SetWindows(Xstart, Ystart, Xend, Yend);

        for (let y = Ystart; y < Yend; y++) {
            const Addr = (y * LCD_WIDTH + Xstart) * 2;
            SPIRAM_RD_Stream(Addr, rbuf, readBytes);

            pins.digitalWritePin(DigitalPin.P12, 1);
            pins.digitalWritePin(DigitalPin.P16, 0);
            for (let i = 0; i < pixels; i++) {
                pins.spiWrite(rbuf[i * 2]);
                pins.spiWrite(rbuf[i * 2 + 1]);
            }
            pins.digitalWritePin(DigitalPin.P16, 1);
        }
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
    //% weight=180
    export function LCD_SetBL(Lev: number): void {
        const value = Math.round(Math.max(0, Math.min(10, Lev)) * 1023 / 10);
        pins.analogWritePin(AnalogPin.P1, value);
    }

    //% blockId=DrawPoint
    //% blockGap=8
    //% block="Draw Point|x %x|y %y|Color %Color|Point Size %Dot"
    //% x.min=1 x.max=160 y.min=1 y.max=128
    //% Color.min=0 Color.max=65535
    //% weight=150
    export function DrawPoint(x: number, y: number, Color: number, Dot: DOT_PIXEL): void {
        for (let XDir_Num = 0; XDir_Num < Dot; XDir_Num++) {
            for (let YDir_Num = 0; YDir_Num < Dot; YDir_Num++) {
                LCD_SetPoint(x + XDir_Num - Dot, y + YDir_Num - Dot, Color);
            }
        }
    }

    //% blockId=DrawLine
    //% blockGap=8
    //% block="Draw Line|Xstart %Xstart|Ystart %Ystart|Xend %Xend|Yend %Yend|Color %Color|Line width %Line_width|Line Style %Line_Style"
    //% Xstart.min=1 Xstart.max=160 Ystart.min=1 Ystart.max=128
    //% Xend.min=1 Xend.max=160 Yend.min=1 Yend.max=128
    //% Color.min=0 Color.max=65535
    //% weight=140
    export function DrawLine(Xstart: number, Ystart: number, Xend: number, Yend: number, Color: number, Line_width: DOT_PIXEL, Line_Style: LINE_STYLE): void {
        if (Xstart > Xend)
            Swop_AB(Xstart, Xend);
        if (Ystart > Yend)
            Swop_AB(Ystart, Yend);

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
        if (Xstart2 > Xend2)
            Swop_AB(Xstart2, Xend2);
        if (Ystart2 > Yend2)
            Swop_AB(Ystart2, Yend2);

        if (Filled == DRAW_FILL.DRAW_FULL) {
            for (let Ypoint = Ystart2; Ypoint < Yend2; Ypoint++) {
                DrawLine(Xstart2, Ypoint, Xend2, Ypoint, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            }
        } else {
            DrawLine(Xstart2, Ystart2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xstart2, Ystart2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xend2, Ystart2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
            DrawLine(Xend2, Yend2, Xstart2, Yend2, Color, Dot_Pixel, LINE_STYLE.LINE_SOLID);
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

    function DisChar_1207(Xchar: number, Ychar: number, Char_Offset: number, Color: number): void {
        let off = Char_Offset;
        for (let Page = 0; Page < 12; Page++) {
            for (let Column = 0; Column < 7; Column++) {
                if (Font12_Table[off] & (0x80 >> (Column % 8)))
                    LCD_SetPoint(Xchar + Column, Ychar + Page, Color);

                if (Column % 8 == 7)
                    off++;
            }
            if (7 % 8 != 0)
                off++;
        }
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
