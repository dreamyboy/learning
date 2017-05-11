# 一、创建github项目
1. 利用github api创建Repository，会返回一大推的URL，找到里面的clone_url字段：
```
curl -u yourUsername -X POST https://api.github.com/user/repos -d '{"name":"nameOfRepo","description":"description"}'
```

，如：

```
curl -u xudeming208 -X POST https://api.github.com/user/repos -d '{"name":"github","description":"just use command operate github"}'
```
2. 本地建设git仓库，并传到第一步创建的仓库：

```
mkdir github
git init
vi README.md
git add .
git commit -m "just use command operate github"
git remote add origin https://github.com/xudeming208/github.git
git push --set-upstream origin master
```


# 二、删除github项目
1. 先生成token，并找到token字段：

```
curl -v -u xudeming208 -X POST https://api.github.com/authorizations -d '{"scopes":["delete_repo"], "note":"token with delete repo scope"}'
```

** 注意如果要重新生成新的token，需要更改上面命令的note的值，如果请求失败，看下是否超过请求次数https://developer.github.com/v3/#rate-limiting **


2. 

```
curl -X DELETE -H 'Authorization: token {access token goes here}' https://api.github.com/repos/{yourUsername}/{name of repo}
```

，如：

```
curl -X DELETE -H 'Authorization: token 0db95fc659e25f1c02cb2f34247f435c196dc22b' https://api.github.com/repos/xudeming208/github
```



# 三、参考
* https://developer.github.com/v3/repos/
* http://stackoverflow.com/questions/19319516/how-to-delete-a-github-repo-using-the-api
* https://api.github.com/
* Google搜索“github create repository api”和“github delete repository api”
