#include "pxt.h"
#include "LCD_Driver.h"
#include "SPI_RAM.h"

namespace pins {
void spiPins(int mosi, int miso, int sck);
void spiFormat(int bits, int mode);
void spiFrequency(int frequency);
int spiWrite(int value);
void digitalWritePin(int name, int value);
void analogWritePin(int name, int value);
void analogSetPeriod(int name, int micros);
}

#define LCD_SPI_Write_Byte(value) pins::spiWrite(value)

#define LCD_PIN_RST 108 // DigitalPin.P8
#define LCD_PIN_DC 112  // DigitalPin.P12
#define LCD_PIN_CS 116  // DigitalPin.P16
#define LCD_PIN_BL 101  // AnalogPin.P1

#define LCD_RST_0 pins::digitalWritePin(LCD_PIN_RST, 0)
#define LCD_RST_1 pins::digitalWritePin(LCD_PIN_RST, 1)
#define LCD_DC_0 pins::digitalWritePin(LCD_PIN_DC, 0)
#define LCD_DC_1 pins::digitalWritePin(LCD_PIN_DC, 1)
#define LCD_CS_0 pins::digitalWritePin(LCD_PIN_CS, 0)
#define LCD_CS_1 pins::digitalWritePin(LCD_PIN_CS, 1)

#define Driver_Delay_ms(xms) pxt::sleep_ms(xms)

static SPIRAM g_spiram;

static void swapInt(int &a, int &b)
{
    int t = a;
    a = b;
    b = t;
}

void LCD_Driver::LCD_SPI_Init(void)
{
    LCD_CS_1;
}

void LCD_Driver::LCD_Reset(void)
{
    LCD_RST_1;
    Driver_Delay_ms(100);
    LCD_RST_0;
    Driver_Delay_ms(100);
    LCD_RST_1;
    Driver_Delay_ms(100);
}

void LCD_Driver::LCD_WriteReg(UBYTE Reg)
{
    LCD_DC_0;
    LCD_CS_0;
    LCD_SPI_Write_Byte(Reg);
    LCD_CS_1;
}

void LCD_Driver::LCD_WriteData_8Bit(UBYTE Data)
{
    LCD_DC_1;
    LCD_CS_0;
    LCD_SPI_Write_Byte(Data);
    LCD_CS_1;
}

void LCD_Driver::LCD_WriteData_Buf(UWORD Buf, unsigned long Len)
{
    unsigned long i;
    LCD_DC_1;
    LCD_CS_0;
    for (i = 0; i < Len; i++) {
        LCD_SPI_Write_Byte((int)((Buf >> 8) & 0xff));
        LCD_SPI_Write_Byte((int)(Buf & 0xff));
    }
    LCD_CS_1;
}

void LCD_Driver::LCD_InitReg(void)
{
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

    LCD_WriteReg(0xB4);
    LCD_WriteData_8Bit(0x07);

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

    LCD_WriteReg(0xC5);
    LCD_WriteData_8Bit(0x0E);

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

    LCD_WriteReg(0xF0);
    LCD_WriteData_8Bit(0x01);

    LCD_WriteReg(0xF6);
    LCD_WriteData_8Bit(0x00);

    LCD_WriteReg(0x3A);
    LCD_WriteData_8Bit(0x05);

    LCD_WriteReg(0x36);
    LCD_WriteData_8Bit(0xF7 & 0xA0);
}

void LCD_Driver::LCD_SetWindows(UWORD Xstart, UWORD Ystart, UWORD Xend, UWORD Yend)
{
    LCD_WriteReg(0x2A);
    LCD_WriteData_8Bit(0x00);
    LCD_WriteData_8Bit((Xstart & 0xff) + 1);
    LCD_WriteData_8Bit(0x00);
    LCD_WriteData_8Bit(((Xend - 1) & 0xff) + 1);

    LCD_WriteReg(0x2B);
    LCD_WriteData_8Bit(0x00);
    LCD_WriteData_8Bit((Ystart & 0xff) + 2);
    LCD_WriteData_8Bit(0x00);
    LCD_WriteData_8Bit(((Yend - 1) & 0xff) + 2);

    LCD_WriteReg(0x2C);
}

void LCD_Driver::LCD_SetCursor(UWORD Xpoint, UWORD Ypoint)
{
    LCD_SetWindows(Xpoint, Ypoint, Xpoint, Ypoint);
}

void LCD_Driver::LCD_SetColor(UWORD Color, UWORD Xpoint, UWORD Ypoint)
{
    LCD_WriteData_Buf(Color, (unsigned long)Xpoint * (unsigned long)Ypoint);
}

void LCD_Driver::LCD_Init(void)
{
    pins::spiPins(115, 114, 113);
    pins::spiFormat(8, 0);
    pins::spiFrequency(8000000);
    pins::analogSetPeriod(LCD_PIN_BL, 20000);
    pins::analogWritePin(LCD_PIN_BL, 1023);

    LCD_SPI_Init();
    g_spiram.SPIRAM_SPI_Init();
    g_spiram.SPIRAM_Set_Mode(BYTE_MODE);

    LCD_Reset();
    LCD_InitReg();

    LCD_WriteReg(0x11);
    Driver_Delay_ms(120);
    LCD_WriteReg(0x29);
}

void LCD_Driver::LCD_SetBL(int Lev)
{
    if (Lev < 0)
        Lev = 0;
    if (Lev > 10)
        Lev = 10;
    pins::analogWritePin(LCD_PIN_BL, (Lev * 1023) / 10);
}

void LCD_Driver::LCD_Clear(UWORD Color)
{
    LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);
    LCD_SetColor(Color, LCD_WIDTH + 2, LCD_HEIGHT + 2);
}

void LCD_Driver::LCD_ClearBuf(void)
{
    UBYTE line[LCD_WIDTH * 2];
    UBYTE hi = (UBYTE)(WHITE >> 8);
    UBYTE lo = (UBYTE)(WHITE & 0xff);
    int i;

    for (i = 0; i < LCD_WIDTH; i++) {
        line[i * 2] = hi;
        line[i * 2 + 1] = lo;
    }

    g_spiram.SPIRAM_Set_Mode(STREAM_MODE);
    for (i = 0; i < LCD_HEIGHT; i++) {
        g_spiram.SPIRAM_WR_Stream(i * LCD_WIDTH * 2, line, sizeof(line));
    }
}

void LCD_Driver::LCD_SetPoint(UWORD Xpoint, UWORD Ypoint, UWORD Color)
{
    UWORD Addr = (Xpoint + Ypoint * LCD_WIDTH) * 2;
    g_spiram.SPIRAM_WR_Byte(Addr, Color >> 8);
    g_spiram.SPIRAM_WR_Byte(Addr + 1, Color & 0xff);
}

void LCD_Driver::LCD_Display(void)
{
    UBYTE RBUF[LCD_WIDTH * 2 * 2];
    int x;
    int y;

    memset(RBUF, 0xff, sizeof(RBUF));

    g_spiram.SPIRAM_Set_Mode(STREAM_MODE);
    LCD_SetWindows(0, 0, LCD_WIDTH, LCD_HEIGHT);

    for (y = 0; y < LCD_HEIGHT / 2; y++) {
        g_spiram.SPIRAM_RD_Stream(y * LCD_WIDTH * 2 * 2, RBUF, sizeof(RBUF));

        LCD_DC_1;
        LCD_CS_0;
        for (x = 0; x < LCD_WIDTH * 2; x++) {
            LCD_SPI_Write_Byte((uint8_t)RBUF[x * 2]);
            LCD_SPI_Write_Byte((uint8_t)RBUF[x * 2 + 1]);
        }
        LCD_CS_1;
    }
}

void LCD_Driver::LCD_DisplayWindows(UWORD Xstart, UWORD Ystart, UWORD Xend, UWORD Yend)
{
    UBYTE RBUF[(Xend - Xstart + 1) * 2];
    int x;
    int y;

    memset(RBUF, 0xff, sizeof(RBUF));

    g_spiram.SPIRAM_Set_Mode(STREAM_MODE);
    LCD_SetWindows(Xstart, Ystart, Xend, Yend);

    for (y = Ystart; y < Yend; y++) {
        g_spiram.SPIRAM_RD_Stream((y * LCD_WIDTH + Xstart) * 2, RBUF, sizeof(RBUF));

        LCD_DC_1;
        LCD_CS_0;
        for (x = 0; x < Xend - Xstart; x++) {
            LCD_SPI_Write_Byte((uint8_t)RBUF[x * 2]);
            LCD_SPI_Write_Byte((uint8_t)RBUF[x * 2 + 1]);
        }
        LCD_CS_1;
    }
}

void LCD_Driver::LCD_DrawPoint(int x, int y, int Color, int Dot)
{
    int XDir_Num;
    int YDir_Num;

    for (XDir_Num = 0; XDir_Num < Dot; XDir_Num++) {
        for (YDir_Num = 0; YDir_Num < Dot; YDir_Num++) {
            LCD_SetPoint(x + XDir_Num - Dot, y + YDir_Num - Dot, Color);
        }
    }
}

void LCD_Driver::LCD_DrawHLine(int Xstart, int Xend, int Y, int Color, int Dot)
{
    if (Xstart > Xend)
        swapInt(Xstart, Xend);

    for (int x = Xstart; x <= Xend; x++) {
        LCD_DrawPoint(x, Y, Color, Dot);
    }
}

void LCD_Driver::LCD_DrawLine(int Xstart, int Ystart, int Xend, int Yend, int Color, int Dot, int LineStyle)
{
    int Xpoint = Xstart;
    int Ypoint = Ystart;
    int dx = Xend - Xstart >= 0 ? Xend - Xstart : Xstart - Xend;
    int dy = Yend - Ystart <= 0 ? Yend - Ystart : Ystart - Yend;
    int XAddway = Xstart < Xend ? 1 : -1;
    int YAddway = Ystart < Yend ? 1 : -1;
    int Esp = dx + dy;
    int Line_Style_Temp = 0;

    for (;;) {
        Line_Style_Temp++;
        if (LineStyle == LINE_DOTTED && Line_Style_Temp % 3 == 0) {
            LCD_DrawPoint(Xpoint, Ypoint, WHITE, Dot);
            Line_Style_Temp = 0;
        } else {
            LCD_DrawPoint(Xpoint, Ypoint, Color, Dot);
        }

        if (2 * Esp >= dy) {
            if (Xpoint == Xend)
                break;
            Esp += dy;
            Xpoint += XAddway;
        }
        if (2 * Esp <= dx) {
            if (Ypoint == Yend)
                break;
            Esp += dx;
            Ypoint += YAddway;
        }
    }
}

void LCD_Driver::LCD_DrawRectangle(int Xstart, int Ystart, int Xend, int Yend, int Color, int Filled, int Dot)
{
    int Ypoint;

    if (Xstart > Xend)
        swapInt(Xstart, Xend);
    if (Ystart > Yend)
        swapInt(Ystart, Yend);

    if (Filled == DRAW_FULL) {
        for (Ypoint = Ystart; Ypoint < Yend; Ypoint++) {
            LCD_DrawLine(Xstart, Ypoint, Xend, Ypoint, Color, Dot, LINE_SOLID);
        }
    } else {
        LCD_DrawLine(Xstart, Ystart, Xend, Ystart, Color, Dot, LINE_SOLID);
        LCD_DrawLine(Xstart, Ystart, Xstart, Yend, Color, Dot, LINE_SOLID);
        LCD_DrawLine(Xend, Yend, Xend, Ystart, Color, Dot, LINE_SOLID);
        LCD_DrawLine(Xend, Yend, Xstart, Yend, Color, Dot, LINE_SOLID);
    }
}

void LCD_Driver::LCD_DrawCircle(int Xcenter, int Ycenter, int Radius, int Color, int Filled, int Dot)
{
    int XCurrent = 0;
    int YCurrent = Radius;
    int Esp = 3 - (Radius << 1);
    int sCountY;

    if (Filled == DRAW_FULL) {
        while (XCurrent <= YCurrent) {
            for (sCountY = XCurrent; sCountY <= YCurrent; sCountY++) {
                LCD_DrawPoint(Xcenter + XCurrent, Ycenter + sCountY, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter - XCurrent, Ycenter + sCountY, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter - sCountY, Ycenter + XCurrent, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter - sCountY, Ycenter - XCurrent, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter - XCurrent, Ycenter - sCountY, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter + XCurrent, Ycenter - sCountY, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter + sCountY, Ycenter - XCurrent, Color, DOT_PIXEL_1);
                LCD_DrawPoint(Xcenter + sCountY, Ycenter + XCurrent, Color, DOT_PIXEL_1);
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
            LCD_DrawPoint(Xcenter + XCurrent, Ycenter + YCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter - XCurrent, Ycenter + YCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter - YCurrent, Ycenter + XCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter - YCurrent, Ycenter - XCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter - XCurrent, Ycenter - YCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter + XCurrent, Ycenter - YCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter + YCurrent, Ycenter - XCurrent, Color, Dot);
            LCD_DrawPoint(Xcenter + YCurrent, Ycenter + XCurrent, Color, Dot);

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

void LCD_Driver::LCD_DisChar_1207(int Xchar, int Ychar, int Char_Offset, int Color)
{
    int Page;
    int Column;
    const unsigned char *ptr = &Font12_Table[Char_Offset];

    for (Page = 0; Page < 12; Page++) {
        for (Column = 0; Column < 7; Column++) {
            if (*ptr & (0x80 >> (Column % 8)))
                LCD_SetPoint(Xchar + Column, Ychar + Page, Color);

            if (Column % 8 == 7)
                ptr++;
        }
        if (7 % 8 != 0)
            ptr++;
    }
}
