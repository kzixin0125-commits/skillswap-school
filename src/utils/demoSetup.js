import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc, collection, addDoc, getDocs, query, where } from "firebase/firestore";
import { auth, db } from "../firebase/firebase";

// Demo 假用户数据
const DEMO_USERS = [
  {
    name: "Alex Tan",
    email: "alex.demo@learnmate.com",
    password: "demo123456",
    phone: "012-3456789",
    bio: "Software engineering student. I love teaching Python and coding.",
    skills: [
      { name: "Python", category: "Technology", level: "Advanced", description: "From basics to OOP" },
      { name: "JavaScript", category: "Technology", level: "Intermediate", description: "Web development" },
    ],
    wanted: [
      { name: "Canva", category: "Creative" },
      { name: "Public Speaking", category: "Business" },
    ],
  },
  {
    name: "Sarah Lim",
    email: "sarah.demo@learnmate.com",
    password: "demo123456",
    phone: "019-8765432",
    bio: "Design student. Canva expert and presentation designer.",
    skills: [
      { name: "Canva", category: "Creative", level: "Advanced", description: "Design posters & slides" },
      { name: "Presentation Design", category: "Creative", level: "Advanced", description: "Make slides look pro" },
    ],
    wanted: [
      { name: "Python", category: "Technology" },
      { name: "Guitar", category: "Music" },
    ],
  },
  {
    name: "小明",
    email: "ming.demo@learnmate.com",
    password: "demo123456",
    phone: "011-22223333",
    bio: "Music lover. I can teach guitar and basic music theory.",
    skills: [
      { name: "Guitar", category: "Music", level: "Intermediate", description: "Acoustic guitar for beginners" },
    ],
    wanted: [
      { name: "English", category: "Languages" },
      { name: "Canva", category: "Creative" },
    ],
  },
];

// 创建 demo 用户（如果不存在）
async function ensureUser(userData) {
  try {
    // 尝试登录（如果已存在）
    const cred = await signInWithEmailAndPassword(auth, userData.email, userData.password);
    return cred.user;
  } catch (err) {
    // 不存在则创建
    try {
      const cred = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const user = cred.user;

      await updateProfile(user, { displayName: userData.name });

      await setDoc(doc(db, "users", user.uid), {
        name: userData.name,
        email: userData.email,
        phone: userData.phone,
        bio: userData.bio,
        rating: 4.8,
        completedSwaps: 5,
        createdAt: new Date().toISOString(),
      });

      // 添加技能
      for (const skill of userData.skills) {
        await addDoc(collection(db, "skills"), {
          userId: user.uid,
          name: skill.name,
          category: skill.category,
          level: skill.level,
          description: skill.description,
          createdAt: new Date().toISOString(),
        });
      }

      // 添加想学的技能
      for (const wish of userData.wanted) {
        await addDoc(collection(db, "wantedSkills"), {
          userId: user.uid,
          name: wish.name,
          category: wish.category,
          createdAt: new Date().toISOString(),
        });
      }

      return user;
    } catch (createErr) {
      console.error("Failed to create demo user:", createErr);
      return null;
    }
  }
}

// 主函数：设置整个 Demo
export async function setupDemo() {
  // 1. 创建 3 个假用户
  const users = [];
  for (const u of DEMO_USERS) {
    const user = await ensureUser(u);
    if (user) users.push(user);
  }

  // 2. 用 main demo account 登录
  const demoEmail = "demo@learnmate.com";
  const demoPassword = "demo123456";

  let demoUser;
  try {
    const cred = await signInWithEmailAndPassword(auth, demoEmail, demoPassword);
    demoUser = cred.user;
  } catch {
    const cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPassword);
    demoUser = cred.user;

    await updateProfile(demoUser, { displayName: "Demo User" });

    await setDoc(doc(db, "users", demoUser.uid), {
      name: "Demo User",
      email: demoEmail,
      phone: "012-0000000",
      bio: "This is a demo account. Explore freely!",
      rating: 4.5,
      completedSwaps: 2,
      createdAt: new Date().toISOString(),
    });

    // Demo User 的技能
    const mySkills = [
      { name: "Canva", category: "Creative", level: "Advanced", description: "Poster & slide design" },
      { name: "Python", category: "Technology", level: "Intermediate", description: "Basics and automation" },
    ];
    for (const skill of mySkills) {
      await addDoc(collection(db, "skills"), {
        userId: demoUser.uid,
        ...skill,
        createdAt: new Date().toISOString(),
      });
    }

    // Demo User 想学的
    const myWanted = [
      { name: "Guitar", category: "Music" },
      { name: "Public Speaking", category: "Business" },
    ];
    for (const wish of myWanted) {
      await addDoc(collection(db, "wantedSkills"), {
        userId: demoUser.uid,
        ...wish,
        createdAt: new Date().toISOString(),
      });
    }

    // 创建一个 incoming request（Alex 发给 Demo User）
    if (users[0]) {
      await addDoc(collection(db, "requests"), {
        senderId: users[0].uid,
        receiverId: demoUser.uid,
        senderSkill: "Python",
        receiverSkill: "Canva",
        status: "pending",
        createdAt: new Date().toISOString(),
      });
    }

    // 创建一个 outgoing request（Demo User 发给 Sarah）
    if (users[1]) {
      await addDoc(collection(db, "requests"), {
        senderId: demoUser.uid,
        receiverId: users[1].uid,
        senderSkill: "Canva",
        receiverSkill: "Python",
        status: "accepted",
        createdAt: new Date().toISOString(),
      });
    }
  }

  return demoUser;
}

// 退出 demo
export async function logoutDemo() {
  const { signOut } = await import("firebase/auth");
  await signOut(auth);
}