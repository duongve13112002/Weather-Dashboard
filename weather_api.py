import requests
from datetime import datetime, timedelta


def is_time_difference_greater_than_one_hour(time1, time2):
    datetime1 = datetime.strptime(time1, "%Y-%m-%d %H:%M:%S")
    datetime2 = datetime.strptime(time2, "%Y-%m-%d %H:%M:%S")
    
    difference = abs(datetime1 - datetime2)
    
    return difference >= timedelta(hours=1)

API_KEY = 'your_api'
weather_cache = {}
date_check = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

def get_weather_data(city = "",lat = "",lon = "",day = 5):
    if city !="":
        url = f'http://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={city}&days={day}'
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    elif lat != "" and lon != "":
        url = f'http://api.weatherapi.com/v1/forecast.json?key={API_KEY}&q={lat},{lon}&days={day}'
        response = requests.get(url)
        if response.status_code == 200:
            return response.json()
        else:
            return None
    return None

def more_weather_data(city = '',lat = '',lon = ''):
    global weather_cache
    #print(weather_cache[lat+lon])
    if city != '':
        wanted_day = weather_cache[city]['days'] + 4
        weather_cache.pop(city,None)
        data = get_weather_data(city = city, day = wanted_day)
        weather_cache[city] ={
            'data': data,
            'timestamp': datetime.now(),
            'days' : wanted_day
        }
        return data 
    elif lat != '' and lon != '':
        wanted_day = weather_cache[lat+lon]['days'] + 4
        weather_cache.pop(lat+lon,None)
        data = get_weather_data(lat = lat, lon = lon, day = wanted_day)
        weather_cache[lat+lon] ={
            'data': data,
            'timestamp': datetime.now(),
            'days' : wanted_day
        }
        return data 
    return None

def save_weather_data(city, data):
    global weather_cache
    timestamp = datetime.now()
    weather_cache[city] = {
        'data': data,
        'timestamp': timestamp,
        'days' : 5
    }

def get_cached_weather_data(city):
    global weather_cache, date_check
    #Remove all weather_cache when more than 50 caches or There's a one-hour time difference.
    if len(weather_cache) >= 50 or is_time_difference_greater_than_one_hour(date_check,datetime.now().strftime("%Y-%m-%d %H:%M:%S")):
        weather_cache = {}
        date_check = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    cached_data = weather_cache.get(city)
    if cached_data:
        # Check if the cached data is from today
        if cached_data['timestamp'].date() == datetime.now().date():
            return cached_data['data']
    return None
