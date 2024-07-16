from flask import Flask, render_template, request, jsonify
from weather_api import get_weather_data, save_weather_data, get_cached_weather_data,more_weather_data
from flask_mail import Mail, Message

app = Flask(__name__)

app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = 'your_email@example.com'
app.config['MAIL_PASSWORD'] = 'your_password'

mail = Mail(app)

city = ''
lat = ''
lon = ''

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/weather', methods=['GET'])
def weather():
    global city, lat,lon
    lat = lon = ''
    city = request.args.get('city')
    if city:
        # Check cache first
        cached_data = get_cached_weather_data(city)
        if cached_data:
            return jsonify(cached_data)
        
        # If not in cache, fetch from API
        data = get_weather_data(city = city)
        if data:
            save_weather_data(city, data)
            return jsonify(data)
        else:
            return jsonify({'error': 'City not found'}), 404
    else:
        return jsonify({'error': 'No city provided'}), 400

@app.route('/weatherlocation', methods=['GET'])
def weatherlocation():
    global city, lat,lon
    city = ''
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if lat and lon:
        # Check cache first
        cached_data = get_cached_weather_data(lat+lon)
        if cached_data:
            return jsonify(cached_data)
        
        # If not in cache, fetch from API
        data = get_weather_data(lat = lat, lon = lon)
        if data:
            save_weather_data(lat+lon, data)
            return jsonify(data)
        else:
            return jsonify({'error': 'City not found'}), 404
    else:
        return jsonify({'error': 'No city provided'}), 400


@app.route('/load_more_forecast', methods=['GET'])
def more_forecast():
    global city, lat,lon
    if (lat !='' and lon != '') or city != '':
        data = more_weather_data(city = city, lat = lat, lon = lon)
        if data:
            return jsonify(data)
        else:
            return jsonify({'error': 'City not found'}), 404
    else:
        return jsonify({'error': 'No city provided'}), 400

@app.route('/subscribe', methods=['POST'])
def subscribe():
    email = request.json.get('email')
    if email:
        msg = Message('Weather Subscription', sender='your_email@example.com', recipients=[email])
        msg.body = 'Thank you for subscribing to daily weather updates!'
        mail.send(msg)
        return jsonify({'message': 'Subscription successful, please check your email to confirm.'})
    else:
        return jsonify({'error': 'No email provided'}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=7860)
