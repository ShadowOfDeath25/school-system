export const validator = {
    users: {
        email: (email) => {
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/ig.test(email)
        },
        password: (password) => {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/.test(password)
        },
        confirmPassword: (password, confirmation) => {
            return password === confirmation
        },
    }
}
