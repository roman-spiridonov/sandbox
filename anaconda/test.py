from urllib import urlopen

story = urlopen('http://sixty-north.com/c/t.txt').read()
story_words = []
for line in story.split('\n'):
    print line
    line_words = line.split()
    for word in line_words:
        story_words.append(word)