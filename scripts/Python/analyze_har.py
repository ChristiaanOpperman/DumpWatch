import json
import pandas as pd
import matplotlib.pyplot as plt
import ace_tools as tools  # Enables dataframe display in ChatGPT

# Load the HAR file
with open('localhost.har', 'r', encoding='utf-8') as file:
    har_data = json.load(file)

# Extract entries
entries = har_data['log']['entries']

# Convert to DataFrame
data = []
for entry in entries:
    request = entry['request']
    response = entry['response']
    timings = entry['timings']

    data.append({
        "URL": request["url"],
        "Method": request["method"],
        "Status": response["status"],
        "Size (KB)": response.get("bodySize", 0) / 1024,  # Convert bytes to KB
        "Time (ms)": timings.get("wait", 0),  # Time taken
        "Type": request.get("headers", [{}])[0].get("name", "Unknown"),  # Content type
    })

df = pd.DataFrame(data)

# Display table
tools.display_dataframe_to_user(name="Network Request Data", dataframe=df)
