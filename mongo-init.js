db.createUser({
    user: "${USERS_MONGO_HOST}",
    pwd: "${USERS_MONGO_PASS}",
    roles: [
        {
            role: "readWrite",
        },
    ],
});
