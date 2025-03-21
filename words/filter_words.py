import os
import unicodedata

def file_exists(filename):
    """Checks if a file exists"""
    return os.path.isfile(filename)


def import_file(filename):
    """Imports file content and returns a list of its lines"""
    try:
        with open(filename, "r") as file:
            return file.read().splitlines()
    except FileNotFoundError:
        print(f"Couldn't find {filename}...")
        return None


def export_file(lst, filename):
    """Exports a list of words to a file"""
    count_words = 0
    if file_exists(filename):
        print(f"{filename} already exists!")
        return
    with open(filename, "w") as file:
        for word in lst:
            count_words += 1
            file.write(word + "\n")
    print(f"Exported {count_words} words to {filename}")
    count_words = 0
    return


def filter_words(lst, length):
    """Returns a list of words with the specified length"""
    filtered_words = []
    for word in lst:
        if len(word) == length:
            filtered_words.append(word)
    return filtered_words


def clean_list_of_words(lst):
    """Removes duplicates and returns a sorted list of words"""
    """Also removes spaces, lines and bad characters"""
    cleaned_list = []

    for word in lst:
        if "-" not in word:
            cleaned_word = remove_accents(word).upper().replace(" ", "")
            cleaned_list.append(cleaned_word)

    return sorted(list(set(cleaned_list)))


def remove_accents(text):
    """Removes accents from text, converting to base characters"""
    normalized = unicodedata.normalize('NFD', text)
    return ''.join([c for c in normalized if not unicodedata.combining(c)])


def main():
    words = import_file("words.txt")

    length_words = [5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]

    # Render file for each length of words
    for length in length_words:
        filename_export = f"words_length_{length}.txt"
        if not file_exists(filename_export):
            filtered_words = filter_words(words,length)
            filtered_words = clean_list_of_words(filtered_words)
            export_file(filtered_words, filename_export)
        else:
            print(f"{filename_export} already exists!")
            continue


if __name__ == "__main__":
    main()