import argparse
from pathlib import Path
import unicodedata

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_WORD_LENGTHS = (5, 6, 7, 8)


def import_file(filename):
    """Imports file content and returns a list of its lines."""
    path = Path(filename)
    return path.read_text(encoding="utf-8").splitlines()


def export_file(words, filename, overwrite=False):
    """Exports a list of words to a file."""
    path = Path(filename)

    if path.exists() and not overwrite:
        print(f"{path.name} already exists!")
        return

    path.write_text("\n".join(words) + "\n", encoding="utf-8")
    print(f"Exported {len(words)} words to {path.name}")


def filter_words(words, length):
    """Returns a list of words with the specified length."""
    return [word for word in words if len(word) == length]


def clean_word(word):
    """Normalizes a word and removes unsupported characters."""
    cleaned_word = remove_accents(word).upper().replace(" ", "").strip()

    if not cleaned_word.isalpha():
        return None

    return cleaned_word


def clean_list_of_words(words):
    """Removes duplicates and returns a sorted list of normalized words."""
    cleaned_words = set()

    for word in words:
        cleaned_word = clean_word(word)
        if cleaned_word:
            cleaned_words.add(cleaned_word)

    return sorted(cleaned_words)


def remove_accents(text):
    """Removes accents from text, converting to base characters."""
    normalized = unicodedata.normalize('NFD', text)
    return ''.join(c for c in normalized if not unicodedata.combining(c))


def parse_args():
    parser = argparse.ArgumentParser(description="Generate WordHunt word lists by length.")
    parser.add_argument(
        "--source",
        default=BASE_DIR / "words.txt",
        type=Path,
        help="Source file with one word per line.",
    )
    parser.add_argument(
        "--lengths",
        default=DEFAULT_WORD_LENGTHS,
        nargs="+",
        type=int,
        help="Word lengths to export.",
    )
    parser.add_argument(
        "--overwrite",
        action="store_true",
        help="Replace existing generated word files.",
    )
    return parser.parse_args()


def main():
    args = parse_args()
    words = clean_list_of_words(import_file(args.source))

    for length in args.lengths:
        filename_export = BASE_DIR / f"words_length_{length}.txt"
        filtered_words = filter_words(words, length)
        export_file(filtered_words, filename_export, overwrite=args.overwrite)


if __name__ == "__main__":
    main()
