# Database Migration Required

After pulling these changes, you'll need to run the database migration on your MacBook:

```bash
npx prisma migrate dev --name add_user_profile_and_posts
```

This migration adds:
- User profile customization fields (username, coverImage, location, website, socialLinks)
- UserPost model for blog posts, tips, recipes, and vlogs
- PostType and PostStatus enums

If you encounter any issues, you can also use:
```bash
npx prisma db push
```
