# Overview

QuestBoard is a web application that lets users create and track tasks and get rewarded from staying on track with their habits. The application features authentication and the BaaS-database from supabase, a responsive mobile-friendly layout, deployment using vercel and finally unit and component tests.

## Website link

**Link:** https://quest-board-eta.vercel.app/sign-up

## Features

### Account

- Accounts can be created and logged in with
- Ensure secure data handling with supabase
- Allows for user data to be persistant with supabase BaaS

### Quests

- Quests can be created, edited and deleted
- Reoccuring quests can be created if the user wants to complete a certain task every day or weekly
- Each quest has a type dictating when it should expire or refresh

### Progression system

- Get an appropriate reward from completing a task
- Rewards come in the form of XP and Coins

### Shop

- User can spend their coins earned from completing tasks to buy avatars

### Profile

- Personalize your profile with avatars
- Track your current progress, quests earned, completed etc

### Streaks & Badges

- Completing tasks earns a streak based on type of quest completed
- Completing tasks continiously and staying on track rewards badges to track achievements

### Security

- Row level Security (RLS) combined with Supabase Auth for end-to-end user security from browser to the database
- PostgreSQL Policies to ensure that a user can only view and update their own data

### Testing

- Unit-tests to ensure time calculation works as intended
- Component tests for CRUD-operations

## Built With

- React
- Supabase (using PostgreSQL)
- Dayjs for date and time management
- Vitest for testing
- Vercel for deployment

## Installation

**NOTE:** This application is meant to be accessed in the browser as a regular website.
If you want to run the app locally you need to access my private API keys, contact me using my contact information.

**Link:** https://quest-board-eta.vercel.app/sign-up

1.  **Clone Repository**

```bash
https://github.com/r4andom1/QuestBoard.git
```

2. **Install Dependencies**

```bash
cd QuestBoard/frontend
npm install
```

3. **Configure Environment Variables**

- Create a `.env` file with the same variables as the `.env.example` file
- Add the correct API keys

4. **Run Tests**

```
npm run test
```

5. **Run Application**

```
npm run dev
```

## License

This project is licensed under the MIT License. See the LICENSE file for details.
[MIT](https://choosealicense.com/licenses/mit/)

## Contact

- **Email:** kim.petersson301@gmail.com
