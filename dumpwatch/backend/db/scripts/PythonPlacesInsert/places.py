import mysql.connector
import csv

# Database connection configuration
DB_CONFIG = {
    'host': '127.0.0.1',  # Update with your MySQL host
    'user': 'your-username',  # Update with your MySQL user
    'password': 'password',  # Update with your MySQL password
    'database': 'dumpwatch'  # Update with your database name
}

FILE_PATH = 'ZA.txt' 

def insert_data():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        cursor = conn.cursor()

        with open(FILE_PATH, 'r', encoding='utf-8') as file:
            csv_reader = csv.reader(file, delimiter='\t')

            for row in csv_reader:
                if len(row) < 6:
                    continue 
                
                country_code = row[0]
                postal_code = row[1]
                place_name = row[2]
                latitude = float(row[-3]) if row[-3] else None
                longitude = float(row[-2]) if row[-2] else None
                accuracy = int(row[-1]) if row[-1].isdigit() else None

                cursor.execute(
                    "INSERT IGNORE INTO Place (CountryCode, PlaceName) VALUES (%s, %s)",
                    (country_code, place_name)
                )

                cursor.execute(
                    "SELECT PlaceId FROM Place WHERE CountryCode = %s AND PlaceName = %s",
                    (country_code, place_name)
                )
                place_id = cursor.fetchone()[0]

                cursor.execute(
                    "INSERT INTO PlaceDetails (PlaceId, PostalCode, Latitude, Longitude, Accuracy) "
                    "VALUES (%s, %s, %s, %s, %s)",
                    (place_id, postal_code, latitude, longitude, accuracy)
                )

        conn.commit()
        print("Data inserted successfully!")

    except mysql.connector.Error as err:
        print(f"Error: {err}")

    finally:
        cursor.close()
        conn.close()

if __name__ == '__main__':
    insert_data()
