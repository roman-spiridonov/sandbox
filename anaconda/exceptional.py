import sys

def convert(s):
    '''Convert to an integer'''
    # x = -1    
    try:
        # x = int(s)
        return int(s)
        # print("Conversion succeeded! x=",x)
    except  (ValueError, TypeError) as e:  # Tuple of exception types
        print("Conversion error: {}"\
               .format(str(e)),
               file=sys.stderr)
        # pass # You should not normally catch IndentationError, SyntaxError, NameError
        return -1
        
    return x