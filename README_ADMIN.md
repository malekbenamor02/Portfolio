# 🔐 Admin User Management

## Add Admin User

To add a new admin user, use the provided script:

```bash
npm run add-admin
```

This will add the default admin user:
- **Email**: `contact@malekbenamor.dev`
- **Password**: `022006`
- **Name**: `Malek Ben Amor`

### Custom Admin User

To add a custom admin user, edit `scripts/add-admin.js` and change:
- `email`
- `password`
- `name`
- `role` (optional, defaults to 'admin')

Then run:
```bash
npm run add-admin
```

### Manual SQL Method

Alternatively, you can add users directly via Supabase SQL Editor:

1. Generate password hash:
```bash
node -e "const bcrypt=require('bcryptjs'); bcrypt.hash('YOUR_PASSWORD', 12).then(h=>console.log(h))"
```

2. Run in Supabase SQL Editor:
```sql
INSERT INTO users (email, password_hash, name, role, is_active)
VALUES (
  'contact@malekbenamor.dev',
  'PASTE_BCRYPT_HASH_HERE',
  'Malek Ben Amor',
  'admin',
  true
)
ON CONFLICT (email) DO UPDATE
SET 
  password_hash = EXCLUDED.password_hash,
  name = EXCLUDED.name,
  is_active = true;
```

## Login

After adding the admin user, login at:
- **URL**: `/admin/login`
- **Email**: `contact@malekbenamor.dev`
- **Password**: `022006`

## Security Notes

- ⚠️ **Change the default password** after first login!
- The script uses the `SUPABASE_SERVICE_ROLE_KEY` which has full database access
- Never commit `.env.local` to git
- Use strong passwords in production
