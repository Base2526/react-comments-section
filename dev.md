การ Edit library

Example 

react-comments-section

1. แก้ใข ไฟล์ แล้ว npm run build  ทำครั้งทีเราแก้ เราต้อง build ใหม่เพือให้ update

  2. รัน npm start ทิ้งไว้จะ update auto


ขั้นตอน 
1. npm install --save-dev npm-run-all rimraf typescript
  2. File package.json 
      Add "watch": "microbundle-crl-with-assets --css-modules false watch --no-compress --format modern,cjs"

  3. npm run watch 

 สรา้ง แก้ไฟล์  save แล้ว  auto build 

** บ้างกรณี ยังไม่ auto build เราต้อง npm ls -g --depth=0 แล้วทำการ npm unlink ออก แล้ว npm link ด้วย


Force a version update:
npm install react-comments-section-ts@x.x.x --save-exact