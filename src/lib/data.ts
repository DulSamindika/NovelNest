
import type { Book, User } from '@/lib/types';

// The currently logged-in user. In a real app, this would be determined by an auth session.
let LOGGED_IN_USER_ID: string | null = 'user-123';

const allUsers: User[] = [
  {
    uid: 'user-123',
    firstName: 'Jane',
    lastName: 'Doe',
    username: 'janedoe',
    mobileNumber: '+11234567890',
    contactInfo: 'jane.doe@example.com',
    address: '123 Bookworm Lane, Readington, BK 12345',
    profilePicUrl: 'https://picsum.photos/seed/user1/100/100',
    ratings: [
      {
        id: 'rating-1',
        rating: 5,
        feedback: 'Great seller! The book was in excellent condition.',
        customerId: 'user-456',
        customerName: 'John Smith',
      },
      {
        id: 'rating-2',
        rating: 4,
        feedback: 'Fast shipping and friendly communication.',
        customerId: 'user-789',
        customerName: 'Emily Jones',
      },
    ],
  },
  {
    uid: 'user-456',
    firstName: 'John',
    lastName: 'Smith',
    username: 'johnsmith',
    mobileNumber: '+19876543210',
    contactInfo: 'john.smith@example.com',
    address: '456 Novel Avenue, Storyville, BK 67890',
    profilePicUrl: 'https://picsum.photos/seed/user2/100/100',
    ratings: [
      {
        id: 'rating-3',
        rating: 5,
        feedback: 'Book was exactly as described. A pleasure to buy from!',
        customerId: 'user-123',
        customerName: 'Jane Doe',
      },
    ],
  },
  {
    uid: 'user-789',
    firstName: 'Emily',
    lastName: 'Jones',
    username: 'emilyreads',
    mobileNumber: '+15551239876',
    contactInfo: 'emily.j@example.com',
    address: '789 Chapter Street, Tale Town, BK 10112',
    profilePicUrl: 'https://picsum.photos/seed/user3/100/100',
    ratings: [],
  },
   {
    uid: 'user-101',
    firstName: 'Michael',
    lastName: 'Brown',
    username: 'mikeb',
    mobileNumber: '+15558887777',
    contactInfo: 'mbrown@email.com',
    address: '101 Prose Place, Fable City, BK 13141',
    profilePicUrl: 'https://picsum.photos/seed/user4/100/100',
    ratings: [],
  },
  {
    uid: 'user-112',
    firstName: 'Sarah',
    lastName: 'Davis',
    username: 'sarahd',
    mobileNumber: '+15552223333',
    contactInfo: 'sarah.d@web.com',
    address: '112 Verse Vista, Poem Peak, BK 15161',
    profilePicUrl: 'https://picsum.photos/seed/user5/100/100',
    ratings: [],
  },
];

// --- Auth Simulation ---
export function addUser(userData: { firstName: string, lastName: string, email: string }) {
    const newUser: User = {
        uid: `user-${Date.now()}`,
        firstName: userData.firstName,
        lastName: userData.lastName,
        username: `${userData.firstName.toLowerCase()}${userData.lastName.toLowerCase()}`,
        contactInfo: userData.email,
        mobileNumber: 'Not provided',
        address: 'Not provided',
        profilePicUrl: `https://picsum.photos/seed/${Date.now()}/100/100`, // Default pic
        ratings: [],
    };
    allUsers.push(newUser);
}

export function userExists(email: string): boolean {
    return allUsers.some(user => user.contactInfo === email);
}

export function setLoggedInUserByEmail(email: string) {
    const user = allUsers.find(u => u.contactInfo === email);
    if (user) {
        LOGGED_IN_USER_ID = user.uid;
    } else {
        // Fallback to default user if email not found, though logic should prevent this.
        LOGGED_IN_USER_ID = 'user-123';
    }
}

export function setLoggedInUser(user?: User) {
    if (user) {
        // This is now primarily for the old login flow which we're phasing out
        if (!allUsers.find(u => u.uid === user.uid)) {
            allUsers.push(user);
        }
        LOGGED_IN_USER_ID = user.uid;
    } else {
        // This simulates logging in as the default user
        LOGGED_IN_USER_ID = 'user-123';
    }
}

export function clearLoggedInUser() {
    LOGGED_IN_USER_ID = null;
}
// --- End Auth Simulation ---

export const getLoggedInUser = (): User | null => {
    if (!LOGGED_IN_USER_ID) return null;
    return allUsers.find(user => user.uid === LOGGED_IN_USER_ID) || null;
}

export const getUserById = (userId: string): User | null => {
    return allUsers.find(user => user.uid === userId) || null;
}

const booksData: Omit<Book, 'seller'>[] = [
  {
    id: '1',
    title: 'The Midnight Library',
    author: 'Matt Haig',
    genre: 'Fantasy',
    description: "Nora Seed finds herself in a library between life and death, with the chance to experience different versions of her life. This novel explores the choices we make, the regrets that haunt us, and the infinite possibilities that lie in every moment. A captivating story about what it means to live a fulfilling life.",
    condition: 'used-good',
    originalPrice: 26.0,
    sellingPrice: 13.5,
    sellerId: 'user-456',
    sellerName: 'John Smith',
    sellerContact: '555-1234',
    bookImageUrls: [
        'https://picsum.photos/seed/book1/400/600',
        'https://picsum.photos/seed/book1-2/400/600',
        'https://picsum.photos/seed/book1-3/400/600',
    ],
  },
  {
    id: '2',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    genre: 'Sci-Fi',
    description: "Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish. Except that right now, he doesn't know that. He can't even remember his own name, let alone the nature of his assignment or how to complete it. An unforgettable journey into space with a truly relatable hero.",
    condition: 'new',
    originalPrice: 28.0,
    sellingPrice: 20.0,
    sellerId: 'user-789',
    sellerName: 'Emily Jones',
    sellerContact: 'emily@email.com',
    bookImageUrls: [
        'https://picsum.photos/seed/book2/400/600',
        'https://picsum.photos/seed/book2-2/400/600',
    ],
  },
  {
    id: '3',
    title: 'Klara and the Sun',
    author: 'Kazuo Ishiguro',
    genre: 'Sci-Fi',
    description: "From her place in the store, Klara, an Artificial Friend with outstanding observational qualities, watches carefully the behavior of those who come in to browse, and of those who pass on the street outside. She remains hopeful that a customer will soon choose her, but when the possibility emerges that her circumstances may change forever, Klara is warned not to invest too much in the promises of humans.",
    condition: 'used-fair',
    originalPrice: 20.0,
    sellingPrice: 8.0,
    sellerId: 'user-101',
    sellerName: 'Michael Brown',
    sellerContact: 'Call 555-5678',
    bookImageUrls: ['https://picsum.photos/seed/book3/400/600'],
  },
  {
    id: '4',
    title: 'The Four Winds',
    author: 'Kristin Hannah',
    genre: 'Historical Fiction',
    description: "Texas, 1934. Millions are out of work and a drought has broken the Great Plains. Farmers are fighting to keep their land and their livelihoods as the crops are failing, the water is drying up, and dust threatens to bury them all. One of the most defining periods of American history, brought to life with Kristin Hannah's rich, dimensional characters.",
    condition: 'used-good',
    originalPrice: 30.0,
    sellingPrice: 15.0,
    sellerId: 'user-456',
    sellerName: 'John Smith',
    sellerContact: '555-1234',
    bookImageUrls: [
        'https://picsum.photos/seed/book4/400/600',
        'https://picsum.photos/seed/book4-2/400/600',
    ],
  },
  {
    id: '5',
    title: 'Circe',
    author: 'Madeline Miller',
    genre: 'Fantasy',
    description: "In the house of Helios, god of the sun and mightiest of the Titans, a daughter is born. But Circe is a strange child--not powerful, like her father, nor viciously alluring like her mother. Turning to the world of mortals for companionship, she discovers that she does possess power--the power of witchcraft, which can transform rivals into monsters and menace the gods themselves.",
    condition: 'new',
    originalPrice: 16.99,
    sellingPrice: 12.0,
    sellerId: 'user-112',
    sellerName: 'Sarah Davis',
    sellerContact: 'sarah.d@web.com',
    bookImageUrls: ['https://picsum.photos/seed/book5/400/600'],
  },
  {
    id: '6',
    title: 'Educated: A Memoir',
    author: 'Tara Westover',
    genre: 'Biography',
    description: 'An unforgettable memoir about a young girl who, kept out of school, leaves her survivalist family and goes on to earn a PhD from Cambridge University. Her quest for knowledge transforms her, taking her over oceans and across continents, to Harvard and to Cambridge. Only then would she wonder if she’d traveled too far, if there was still a way home.',
    condition: 'used-good',
    originalPrice: 28.00,
    sellingPrice: 10.0,
    sellerId: 'user-789',
    sellerName: 'Emily Jones',
    sellerContact: 'emily@email.com',
    bookImageUrls: [
        'https://picsum.photos/seed/book6/400/600',
        'https://picsum.photos/seed/book6-2/400/600',
    ],
  },
  {
    id: '7',
    title: 'Dune',
    author: 'Frank Herbert',
    genre: 'Sci-Fi',
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange, a drug capable of extending life and enhancing consciousness. A stunning blend of adventure and mysticism, environmentalism and politics.",
    condition: 'used-fair',
    originalPrice: 18.00,
    sellingPrice: 7.50,
    sellerId: 'user-123',
    sellerName: 'Jane Doe',
    sellerContact: '+11234567890',
    bookImageUrls: [
        'https://picsum.photos/seed/book7/400/600',
    ],
  },
  {
    id: '8',
    title: 'Atomic Habits',
    author: 'James Clear',
    genre: 'Self-Help',
    description: "No matter your goals, Atomic Habits offers a proven framework for improving--every day. James Clear, one of the world's leading experts on habit formation, reveals practical strategies that will teach you exactly how to form good habits, break bad ones, and master the tiny behaviors that lead to remarkable results.",
    condition: 'new',
    originalPrice: 27.00,
    sellingPrice: 18.00,
    sellerId: 'user-123',
    sellerName: 'Jane Doe',
    sellerContact: '+11234567890',
    bookImageUrls: [
        'https://picsum.photos/seed/book8/400/600',
        'https://picsum.photos/seed/book8-2/400/600',
        'https://picsum.photos/seed/book8-3/400/600',
    ],
  },
];

export const mockBooks: Book[] = booksData.map(book => {
    const seller = getUserById(book.sellerId);
    if (!seller) {
        throw new Error(`Seller with id ${book.sellerId} not found for book ${book.title}`);
    }
    return { ...book, seller };
});

export const getBookById = (bookId: string): Book | null => {
    return mockBooks.find(book => book.id === bookId) || null;
}
