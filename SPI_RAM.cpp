#include "pxt.h"
#include "SPI_RAM.h"

namespace pins {
void spiFormat(int bits, int mode);
void spiFrequency(int frequency);
int spiWrite(int value);
void digitalWritePin(int name, int value);
}

#define SPIRAM_PIN_CS 102 // DigitalPin.P2

#define SPIRAM_SPI_Write_Byte(value) pins::spiWrite(value)
#define SPIRAM_SPI_Read_Byte(value) pins::spiWrite(value)
#define SPIRAM_CS_0 pins::digitalWritePin(SPIRAM_PIN_CS, 0)
#define SPIRAM_CS_1 pins::digitalWritePin(SPIRAM_PIN_CS, 1)

void SPIRAM::SPIRAM_SPI_Init(void)
{
    SPIRAM_CS_1;
}

void SPIRAM::SPIRAM_Set_Mode(BYTE mode)
{
    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_WRSR);
    SPIRAM_SPI_Write_Byte(mode);
    SPIRAM_CS_1;
}

BYTE SPIRAM::SPIRAM_RD_Byte(WORD Addr)
{
    BYTE RD_Byte;

    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_READ);
    SPIRAM_SPI_Write_Byte(0x00);
    SPIRAM_SPI_Write_Byte((BYTE)(Addr >> 8));
    SPIRAM_SPI_Write_Byte((BYTE)Addr);

    RD_Byte = SPIRAM_SPI_Read_Byte(0x00);
    SPIRAM_CS_1;

    return RD_Byte;
}

void SPIRAM::SPIRAM_WR_Byte(WORD Addr, const BYTE Data)
{
    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_WRITE);
    SPIRAM_SPI_Write_Byte(0x00);
    SPIRAM_SPI_Write_Byte((BYTE)(Addr >> 8));
    SPIRAM_SPI_Write_Byte((BYTE)Addr);
    SPIRAM_SPI_Write_Byte(Data);
    SPIRAM_CS_1;
}

void SPIRAM::SPIRAM_RD_Page(WORD Addr, BYTE *pBuf)
{
    WORD i;

    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_READ);
    SPIRAM_SPI_Write_Byte(0x00);
    SPIRAM_SPI_Write_Byte((BYTE)(Addr >> 8));
    SPIRAM_SPI_Write_Byte((BYTE)Addr);

    for (i = 0; i < 32; i++) {
        *pBuf = SPIRAM_SPI_Read_Byte(0x00);
        pBuf++;
    }
    SPIRAM_CS_1;
}

void SPIRAM::SPIRAM_WR_Page(WORD Addr, BYTE *pBuf)
{
    WORD i;

    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_WRITE);
    SPIRAM_SPI_Write_Byte(0x00);
    SPIRAM_SPI_Write_Byte((BYTE)(Addr >> 8));
    SPIRAM_SPI_Write_Byte((BYTE)Addr);

    for (i = 0; i < 32; i++) {
        SPIRAM_SPI_Write_Byte(*pBuf);
        pBuf++;
    }
    SPIRAM_CS_1;
}

void SPIRAM::SPIRAM_RD_Stream(WORD Addr, BYTE *pBuf, unsigned long Len)
{
    WORD i;

    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_READ);
    SPIRAM_SPI_Write_Byte(0x00);
    SPIRAM_SPI_Write_Byte((BYTE)(Addr >> 8));
    SPIRAM_SPI_Write_Byte((BYTE)Addr);

    for (i = 0; i < Len; i++) {
        *pBuf = SPIRAM_SPI_Read_Byte(0x00);
        pBuf++;
    }
    SPIRAM_CS_1;
}

void SPIRAM::SPIRAM_WR_Stream(WORD Addr, BYTE *pBuf, unsigned long Len)
{
    WORD i;

    SPIRAM_CS_0;
    SPIRAM_SPI_Write_Byte(CMD_WRITE);
    SPIRAM_SPI_Write_Byte(0x00);
    SPIRAM_SPI_Write_Byte((BYTE)(Addr >> 8));
    SPIRAM_SPI_Write_Byte((BYTE)Addr);

    for (i = 0; i < Len; i++) {
        SPIRAM_SPI_Write_Byte(*pBuf);
        pBuf++;
    }
    SPIRAM_CS_1;
}
