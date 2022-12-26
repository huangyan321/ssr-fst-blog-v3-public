// 安全拦截器
import jwt from 'jsonwebtoken';
import type { VerifyErrors, JwtPayload } from 'jsonwebtoken';
/**
 * 验证权限
 * @param token
 * @param secretKey 秘钥
 * @param success
 * @param error
 */
function verify(
  token: string,
  secretKey: string,
  success: (str: string | JwtPayload | undefined) => {},
  error: (str: VerifyErrors | null) => {}
) {
  jwt.verify(
    token,
    secretKey,
    function (err, decode: string | JwtPayload | undefined) {
      if (err) {
        if (error) {
          error(err);
        }
      } else {
        if (success) {
          success(decode);
        }
      }
    }
  );
}

/**
 * 签名
 * @param load 载荷 json对象 存储存在
 * @param secretKey 秘钥
 * @param expiresIn 过期时间 秒
 * @returns {number | PromiseLike<ArrayBuffer>}
 */
function sign(
  load: string | object | Buffer,
  secretKey: string,
  expiresIn: string | number | undefined
): string {
  var token = jwt.sign(load, secretKey, { expiresIn: expiresIn });
  return token;
}

/**异步转同步
 * 这个再app.js路由调用中已经转换过一次,所以不用重复转换
 * @param token
 * @param secretKey
 * @returns {Promise<any>}
 */
function verifySync(token: string, secretKey: string): Promise<any> {
  return new Promise((resolve, reject) => {
    jwt.verify(token, secretKey, function (err, decode) {
      if (err) {
        console.log(err.message);
        reject({ err: 'error', msg: '会话已过期' });
      } else {
        console.log('Decryption succeeded');
        resolve(decode);
      }
    });
  });
}

export default { verify, sign, verifySync };

/*//使用解密
let user={id:111,name:'user',password:123456};
/!*
//q清空密码
delete user.password;
let token=sign(user,'123456',10);*!/
//解密
let token=sign(user,'123456',10);
verify(token,"123456",function (user) {
    console.log(user);
},function (err) {
    console.error(err)
    }
)
console.log(token);*/

/*verify(token,'123456',function (user) {
    console.log(user)
},function (err) {
    console.error(err);
})*/
