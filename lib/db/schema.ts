import {
  boolean,
  integer,
  pgTable,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// ─────────────────────────────────────────────────────────────────────────────
// Better Auth tables – keep column names exactly as Better Auth expects
// ─────────────────────────────────────────────────────────────────────────────

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("emailVerified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expiresAt").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
  ipAddress: text("ipAddress"),
  userAgent: text("userAgent"),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  userId: text("userId")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// App tables
// ─────────────────────────────────────────────────────────────────────────────

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  content: text("content").notNull(),
  coverImage: text("coverImage"),
  metaTitle: text("metaTitle"),
  metaDescription: text("metaDescription"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const contactSubmissions = pgTable("contact_submissions", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company"),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
});

// ─────────────────────────────────────────────────────────────────────────────
// About Section tables (admin-manageable)
// ─────────────────────────────────────────────────────────────────────────────

export const aboutSettings = pgTable("about_settings", {
  id: serial("id").primaryKey(),
  key: text("key").notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const aboutValues = pgTable("about_values", {
  id: serial("id").primaryKey(),
  icon: text("icon").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  order: integer("order").notNull().default(0),
});

export const aboutTeam = pgTable("about_team", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  initial: text("initial").notNull(),
  description: text("description"),
  email: text("email"),
  linkedin: text("linkedin"),
  github: text("github"),
  image: text("image"),
  order: integer("order").notNull().default(0),
});

export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  category: text("category").notNull(),
  description: text("description").notNull(),
  image: text("image"),
  link: text("link"),
  color: text("color").notNull().default("from-blue-500/20 to-purple-500/20"),
  order: integer("order").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// Testimonials (admin-manageable)
// ─────────────────────────────────────────────────────────────────────────────

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  image: text("image"),
  order: integer("order").notNull().default(0),
});

// ─────────────────────────────────────────────────────────────────────────────
// Service Pages (admin-manageable dynamic SEO pages)
// ─────────────────────────────────────────────────────────────────────────────

export const servicePages = pgTable("service_pages", {
  id: serial("id").primaryKey(),
  userId: text("userId").notNull(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description").notNull(),
  featuredImage: text("featuredImage"),
  content: text("content").notNull(),
  icon: text("icon").notNull().default("Globe"),
  // SEO fields
  seoTitle: text("seoTitle"),
  seoDescription: text("seoDescription"),
  seoKeywords: text("seoKeywords"),
  canonicalUrl: text("canonicalUrl"),
  ogImage: text("ogImage"),
  twitterCard: text("twitterCard").notNull().default("summary_large_image"),
  robotsMeta: text("robotsMeta").notNull().default("index,follow"),
  // CTA section
  ctaHeading: text("ctaHeading"),
  ctaDescription: text("ctaDescription"),
  ctaButtonText: text("ctaButtonText").notNull().default("Get Started"),
  ctaButtonLink: text("ctaButtonLink").notNull().default("#contact"),
  // Meta
  published: boolean("published").notNull().default(false),
  order: integer("order").notNull().default(0),
  createdAt: timestamp("createdAt").notNull().defaultNow(),
  updatedAt: timestamp("updatedAt").notNull().defaultNow(),
});

export const serviceFaqs = pgTable("service_faqs", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId")
    .notNull()
    .references(() => servicePages.id, { onDelete: "cascade" }),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").notNull().default(0),
});

export const serviceTestimonials = pgTable("service_testimonials", {
  id: serial("id").primaryKey(),
  serviceId: integer("serviceId")
    .notNull()
    .references(() => servicePages.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  role: text("role").notNull(),
  company: text("company"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  order: integer("order").notNull().default(0),
});
