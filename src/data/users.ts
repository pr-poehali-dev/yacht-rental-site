
export interface User {
  id: string;
  name: string;
  email: string;
  password: string; // В реальном приложении пароли должны быть хешированы
  phone?: string;
  role: 'user' | 'admin';
  createdAt: Date;
}

// Демо данные пользователей
const demoUsers: User[] = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan@example.com',
    password: 'password123',
    phone: '+7 (900) 123-45-67',
    role: 'user',
    createdAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Мария Сидорова',
    email: 'maria@example.com',
    password: 'password456',
    role: 'user',
    createdAt: new Date('2024-02-20')
  },
  {
    id: '3',
    name: 'Админ Админович',
    email: 'admin@moreyacht.ru',
    password: 'admin123',
    role: 'admin',
    createdAt: new Date('2024-01-01')
  }
];

let users = [...demoUsers];

// Функции для работы с пользователями
export const getUserByEmail = (email: string): User | undefined => {
  return users.find(user => user.email === email);
};

export const getUserById = (id: string): User | undefined => {
  return users.find(user => user.id === id);
};

export const registerUser = (userData: Omit<User, 'id' | 'role' | 'createdAt'>): User => {
  const newUser: User = {
    ...userData,
    id: `${users.length + 1}`,
    role: 'user',
    createdAt: new Date()
  };
  
  users.push(newUser);
  return newUser;
};

// В реальном приложении здесь должна быть проверка с хешированием
export const validateUser = (email: string, password: string): User | null => {
  const user = getUserByEmail(email);
  if (user && user.password === password) {
    return user;
  }
  return null;
};

export const getAllUsers = (): User[] => {
  return [...users];
};
