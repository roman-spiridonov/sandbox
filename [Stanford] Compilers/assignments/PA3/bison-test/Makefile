CC=cc
CPPINCLUDE= -I.
CFLAGS=-g -Wall -Wno-unused -Wno-deprecated -Wno-write-strings -DDEBUG ${CPPINCLUDE}
CSRC=mfcalc.c
LIBS=-lm  

YSRC=mfcalc.y
BISON=bison
BFLAGS=-d -v --report=lookaheads -g

CALL=${CSRC} mfcalc.tab.c
OBJS=${CALL:.c=.o}

CGEN=mfcalc.tab.c
HGEN=mfcalc.tab.h

# links and produces executable
mfcalc: ${OBJS}
	${CC} ${CFLAGS} ${LIBS} $< -o $@

${CGEN} ${HGEN}: ${YSRC}
	${BISON} ${BFLAGS} ${YSRC}

# compilers, but does not link (generates *.obj files)
.cpp.o:
	${CC} ${CFLAGS} -c $<

clean:
	-rm -f ${OBJS} ${CGEN} ${HGEN} mfcalc
