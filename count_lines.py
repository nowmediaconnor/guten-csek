import os
import argparse


def count_lines_in_folder(folder_path, ignore_list):
    total_lines = 0

    # Check if the provided path is a valid directory
    if not os.path.isdir(folder_path):
        print(f"Error: '{folder_path}' is not a valid directory.")
        return

    # Create a set of ignored items for faster lookup
    ignore_set = set(ignore_list)

    # Iterate through all files in the directory
    for root, dirs, files in os.walk(folder_path):
        # Exclude ignored folders
        dirs[:] = [d for d in dirs if d not in ignore_set]

        for file_name in files:
            if file_name in ignore_set:
                continue

            file_path = os.path.join(root, file_name)
            try:
                with open(file_path, "r", encoding="utf-8") as file:
                    lines = file.readlines()
                    total_lines += len(lines)
            except Exception as e:
                print(f"Error reading '{file_path}': {e}")

    return total_lines


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Count lines in files within a folder."
    )
    parser.add_argument("folder_path", help="Path to the folder to count lines in")
    parser.add_argument(
        "-i",
        "--ignore",
        help="Comma-separated list of folders/files to ignore",
        default="",
    )
    args = parser.parse_args()

    ignore_list = [item.strip() for item in args.ignore.split(",") if item.strip()]
    lines_count = count_lines_in_folder(args.folder_path, ignore_list)
    print(f"Total lines in files within '{args.folder_path}': {lines_count}")
