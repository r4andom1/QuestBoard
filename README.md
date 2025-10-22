# Overview

QuestBoard is a web application that lets users create and track tasks and get rewarded for staying on track with their habits. The application features authentication and the BaaS-database from supabase, a responsive mobile-friendly layout, deployment using vercel and finally unit and component tests.

## Website link

**Link:** quest-board-eta.vercel.app

## Features

### Account

- Accounts can be created and logged in with
- Ensure secure data handling with supabase
- Allows for user data to be persistent with supabase BaaS

### Quests

- Quests can be created, edited and deleted
- Reccuring quests can be created if the user wants to complete a certain task every day or weekly
- Each quest has a type dictating when it should expire or refresh

### Progression system

- Get an appropriate reward for completing a task
- Rewards come in the form of XP and Coins

### Shop

- User can spend their coins earned from completing tasks to buy avatars

### Profile

- Personalize your profile with avatars
- Track your current progress, quests created, completed etc

### Streaks & Badges

- Completing tasks earns a streak based on the type of quest completed
- Completing tasks continiously and staying on track rewards badges to track achievements

### Security

- Row-Level Security (RLS) combined with Supabase Auth ensures end-to-end user security from the browser to the database
- PostgreSQL Policies to ensure that a user can only view and update their own data

### Testing

- Unit tests to ensure time calculation works as intended
- Component tests for CRUD-operations

## Built With

- React
- Supabase (using PostgreSQL)
- Dayjs for date and time management
- Vitest for testing
- Vercel for deployment

## Installation

**NOTE:** This application is meant to be accessed in the browser as a regular website.
If you want to run the app locally, you'll need to access my private API keys. Contact me using my contact information.

**Link:** quest-board-eta.vercel.app

1.  **Clone Repository**

```bash
git clone https://github.com/r4andom1/QuestBoard.git
```

2. **Install Dependencies**

```bash
cd QuestBoard/frontend
npm install
```

3. **Configure Environment Variables**

- Create a `.env` file with the same variables as the `.env.example` file
- Add the correct API keys

4. **Run Application**

```
npm run dev
```

**Run Tests**

```
npm run test
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
[MIT](https://choosealicense.com/licenses/mit/)

## Contact

- **Email:** kim.petersson301@gmail.com
