import paramiko
import os

print("🚀 正在自动上传并部署最新网站到腾讯云北京服务器...")

hostname = '81.70.119.47'
username = 'ubuntu'
password = 'HSYZ@666888'

ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())

try:
    ssh.connect(hostname, username=username, password=password, timeout=10)
    print("✅ 已成功连接腾讯云服务器！")
    
    sftp = ssh.open_sftp()
    local_dir = os.path.dirname(os.path.abspath(__file__))
    files_to_upload = ['index.html', 'styles.css', 'script.js']
    
    for fname in files_to_upload:
        local_path = os.path.join(local_dir, fname)
        remote_path = f'/var/www/gsuux/{fname}'
        if os.path.exists(local_path):
            sftp.put(local_path, remote_path)
            print(f"  └─ 已同步最新文件: {fname}")
            
    sftp.close()
    ssh.close()
    print("\n🎉 部署完成！国内微信及手机极速访问网址：")
    print("👉 https://bot.hszen.com/gsuux/")

except Exception as e:
    print(f"❌ 部署失败: {e}")
