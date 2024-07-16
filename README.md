# Weather Dashboard

Weather Dashboard is a web application that provides current weather information for various locations. The application is built using Python and Flask, and it leverages a weather API to fetch real-time weather data. The project is containerized using Docker.

## Features

- Fetch current weather information for a specified location.
- Display weather data in a user-friendly web interface.
- Dockerized for easy deployment.

## Prerequisites

- Docker
- Docker Compose

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/duongve13112002/Weather-Dashboard.git
    cd Weather-Dashboard
    ```

2. Build the Docker image:

    ```bash
    docker-compose build
    ```

3. Start the application:

    ```bash
    docker-compose up
    ```

4. Open your web browser and go to `http://localhost:7860` to see the application in action.

## Project Structure

- `app.py`: Main application script.
- `docker-compose.yml`: Docker Compose configuration.
- `Dockerfile`: Docker image build instructions.
- `requirements.txt`: Python dependencies.
- `weather_api.py`: Script for interacting with the weather API.
- `static/`: Directory for static files (CSS, JavaScript).
    - `css/style.css`: CSS file for styling the web interface.
    - `js/script.js`: JavaScript file for client-side functionality.
- `templates/`: Directory for HTML templates.
    - `index.html`: Main HTML template for the web interface.

## Usage

1. Navigate to the web interface.
2. Enter the name of a location to fetch the current weather information.
3. View the weather data displayed on the web page.

## Contributing

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-branch`).
5. Create a new Pull Request.

## License

This project is licensed under the Apache License 2.0. See the [LICENSE](LICENSE) file for more details.
