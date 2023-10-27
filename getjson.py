import os
import json

folder_path = "icons"  # Replace with the path to your "icons" folder

if os.path.exists(folder_path) and os.path.isdir(folder_path):
    file_list = os.listdir(folder_path)

    # Filter out only files (not directories)
    file_list = [
        f for f in file_list if os.path.isfile(os.path.join(folder_path, f))
    ]

    # Create a dictionary with filenames as keys
    file_dict = {"files": file_list}

    # Convert the dictionary to a JSON string
    json_data = json.dumps(file_dict, indent=4)

    # Save the JSON data to a file (optional)
    with open("file_list.json", "w") as json_file:
        json_file.write(json_data)

    print(json_data)
else:
    print(f"The folder '{folder_path}' does not exist or is not a directory.")
