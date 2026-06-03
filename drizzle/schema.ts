import { pgTable, unique, serial, text, boolean, timestamp, foreignKey, integer, real } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const blogPosts = pgTable("blog_posts", {
	id: serial().primaryKey().notNull(),
	userId: text().notNull(),
	title: text().notNull(),
	slug: text().notNull(),
	excerpt: text().notNull(),
	content: text().notNull(),
	coverImage: text(),
	metaTitle: text(),
	metaDescription: text(),
	published: boolean().default(false).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("blog_posts_slug_unique").on(table.slug),
]);

export const contactSubmissions = pgTable("contact_submissions", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	company: text(),
	message: text().notNull(),
	read: boolean().default(false).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
});

export const verification = pgTable("verification", {
	id: text().primaryKey().notNull(),
	identifier: text().notNull(),
	value: text().notNull(),
	expiresAt: timestamp({ mode: 'string' }).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow(),
});

export const user = pgTable("user", {
	id: text().primaryKey().notNull(),
	name: text().notNull(),
	email: text().notNull(),
	emailVerified: boolean().default(false).notNull(),
	image: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("user_email_unique").on(table.email),
]);

export const account = pgTable("account", {
	id: text().primaryKey().notNull(),
	accountId: text().notNull(),
	providerId: text().notNull(),
	userId: text().notNull(),
	accessToken: text(),
	refreshToken: text(),
	idToken: text(),
	accessTokenExpiresAt: timestamp({ mode: 'string' }),
	refreshTokenExpiresAt: timestamp({ mode: 'string' }),
	scope: text(),
	password: text(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "account_userId_user_id_fk"
		}).onDelete("cascade"),
]);

export const session = pgTable("session", {
	id: text().primaryKey().notNull(),
	expiresAt: timestamp({ mode: 'string' }).notNull(),
	token: text().notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	ipAddress: text(),
	userAgent: text(),
	userId: text().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "session_userId_user_id_fk"
		}).onDelete("cascade"),
	unique("session_token_unique").on(table.token),
]);

export const aboutSettings = pgTable("about_settings", {
	id: serial().primaryKey().notNull(),
	key: text().notNull(),
	value: text().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("about_settings_key_unique").on(table.key),
]);

export const aboutValues = pgTable("about_values", {
	id: serial().primaryKey().notNull(),
	icon: text().notNull(),
	title: text().notNull(),
	description: text().notNull(),
	order: integer().default(0).notNull(),
});

export const projects = pgTable("projects", {
	id: serial().primaryKey().notNull(),
	title: text().notNull(),
	category: text().notNull(),
	description: text().notNull(),
	image: text(),
	link: text(),
	color: text().default('from-blue-500/20 to-purple-500/20').notNull(),
	order: integer().default(0).notNull(),
});

export const aboutTeam = pgTable("about_team", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	initial: text().notNull(),
	image: text(),
	order: integer().default(0).notNull(),
	description: text(),
	email: text(),
	linkedin: text(),
	github: text(),
});

export const testimonials = pgTable("testimonials", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	role: text().notNull(),
	company: text(),
	content: text().notNull(),
	rating: integer().default(5).notNull(),
	image: text(),
	order: integer().default(0).notNull(),
});

export const services = pgTable("services", {
	id: serial().primaryKey().notNull(),
	userId: text(),
	title: text().notNull(),
	slug: text().notNull(),
	excerpt: text().notNull(),
	content: text().notNull(),
	icon: text(),
	metaTitle: text(),
	metaDescription: text(),
	published: boolean().default(false).notNull(),
	createdAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp({ mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	unique("services_slug_unique").on(table.slug),
]);

export const playingWithNeon = pgTable("playing_with_neon", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	value: real(),
});
