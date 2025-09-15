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
    },
    students: {
        nid: (nid) => {
            return /^[0-9]{14}$/.test(nid)
        }
    },
    guardians: {
        phoneNumber: (phone_number) => {
            return /^(?:\+20|0)?1[0125][0-9]{8}$/.test(phone_number)
        }

    }
}
