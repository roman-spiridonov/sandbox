from math import log
from urllib.request import urlopen
import sys

def print_url(url='http://sixty-north.com/c/t.txt'):
    story = urlopen(url).read()
    story_words = []
    for line in story.split():
        print(line)
        line_words = line.split()
        for word in line_words:
            story_words.append(word)
        
def convert(s):
    ''' Convert to an integer'''
    try:
        return int(s)
    except (ValueError,TypeError) as e:
        print("Conversion error: {}"\
              .format(str(e)),
              file=sys.stderr)
        raise
        
def string_log(s):
    v = convert(s)
    return log(v)