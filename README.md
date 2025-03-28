# Monkey guys

นาย ธนโชติ งามคณะ 6510450411 gbb19

นางสาว วัชราพร ภูวะนสุขสุนทร 6510450933 pickky007

นาย ศุกกฤต ปะมาคะมา 6510450968 9teen-19

# แนะนำโครงงาน

ระบบ Workspace management

โครงงานนี้ เป็นโครงงานเกี่ยวกับการพัฒนา web application ที่ช่วยในการจัดการและสร้างพื้นที่ในการทำงาน(workspace) สำหรับกลุ่มผู้ใช้ โดยใช้เครื่องมือในการพัฒนา ได้แก่ 

**Frontend** - next.js

**Backend** - Laravel

**Database** - MySql

# Local Development

สามารถ clone project และเริ่มการพัฒนาได้ โดย

```
git clone https://github.com/cs441-BRoom/frontend.git <dir>

cd <dir>

docker compose up -d

หรือติดตั้ง

VS Code Dev Container extension - https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers

code .

จากนั้นจะมี pop up ขึ้นมา สามารถกด open in dev container หรือ rebuild and reopen in dev container ได้เลย
```

## Dockerfile - Bundle Appliation for Devlopment [./docker/dev.Dockerfile]

ใช้สำหรับการ bundle dependencies, env config, และ application เข้าไว้ด้วยกัน สามารถรัน application ภายในได้ ด้วยคำสั่ง
docker build -f docker/dev.Dockerfile -t <name>:<tag> .

docker run --rm -u user -p 3000:3000 <name>:<tag>

## Dockerfile - Dev Container [./devcontainer/Dockerfile]

คล้ายกับ dev.Dockerfile แต่จะเพิ่มเติมการติดตั้ง package ที่จำเป็นสำหรับการ remote ทำงานใน container โดยตรง เช่น git, git-flow, bash-completion

## docker-compose.yml - Required Services for Dev, Test, & Prod [./docker-compose.yml]

กำหนด service ที่จำเป็นในการ development

## docker-compose.extend.yml - Required Services for Dev, Test, & Prod [./devcontainer/docker-compose.extend.yml]

override default image path เป็น ./devcontainer/Dockerfile (ใช้งานโดย devcontainer.json)

สามารถรันโดยตรงได้ด้วยคำสั่ง

docker compose -f docker-compose.yml -f .devcontainer/docker-compose.extend.yml up -d --build

## devcontainer.json - Dev inside Container! [./devcontainer/devcontainer.json]

ไฟล์ config VS Code extensions สำหรับการพัฒนาที่จำเป็น และการกำหนดค่า env เพื่อให้ VS Code Server สามารถทำงานได้อย่างตรงความคาดหมาย

