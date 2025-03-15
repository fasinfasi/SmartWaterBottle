from app import create_app

app = create_app()  # Only return the app instance

if __name__ == "__main__":
    app.run(debug=True)
