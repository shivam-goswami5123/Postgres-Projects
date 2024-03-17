
# For DailyPlanr Project

Follow these steps to set up the DailyPlanr project on your local machine:

1. **Clone Repository**: Copy the project files to your local machine.

2. **Navigate to Project Directory**: Go to the directory where you've copied the DailyPlanr project files.

3. **Create .env File**: Create a `.env` file in the project directory.

4. **Define Environment Variables**: In the `.env` file, define all the required environment variables used in the `index.js` file. These variables typically include database connection information such as database URL, username, password, etc.

    Example `.env` file:
    ```
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=my_database
    DB_USER=my_username
    DB_PASSWORD=my_password
    ```

5. **Install Dependencies**: Open a terminal or command prompt in the project directory and run:
    ```
    npm install
    ```

6. **Run the Application**: Once the dependencies are installed, execute the following command to start the application:
    ```
    node index.js
    ```

7. **Access the Web App**: After running the above command, you should be able to access the DailyPlanr web application through your browser at the specified localhost address and port.

**Note**: Make sure you have Node.js and npm installed on your machine before proceeding with these steps. Additionally, ensure that you have PostgreSQL installed and configured with the appropriate permissions and settings as per the `.env` file.
