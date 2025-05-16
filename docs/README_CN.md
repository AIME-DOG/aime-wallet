# AIME Wallet Service
<img src=".assets/LOGO+AIME-light.png" alt="AIME" style="zoom: 50%;" align="center"/>



AIME.DOG：首个社交多链 DEX | 探索 Alpha First

AIME 是首款的以社交为主导的多链 DEX。至于为打造全球极致好用的去中心化交易所。让用户集成交易、社交、讨论、跟单一体的功能体验。

AIME 采用 MPC 钱包结构，让用户的资产为自己所拥有。





Want to read this in english ? Go [here](/readme.md)

<p align="center">
  <a href="https://docs.aime.dog/">Docs</a> - <a href="https://aime.dog/">AIME</a> - <a href="https://aime.dog/invite">Invite</a> - <a href="https://aime.dog/channel">Channel</a>
</p>
<p align="center">
    <img src ="https://img.shields.io/badge/version-0.1.0-blueviolet.svg"/>
    <img src ="https://img.shields.io/badge/platform-windows|linux|macos-yellow.svg"/>
    <img src ="https://img.shields.io/badge/database-mysql|8.0+-orange.svg"/>
    <img src ="https://img.shields.io/badge/nodejs-20-blue.svg" />
</p>



## 初衷

AIME 致力于为用户提供一套安全、简洁、易用的 DEX。我们将用户的资产安全放在第一位。在此前提下，会保障用户拥有类似于中心化交易所的体验。



### 钱包的筛选

我们对很多的钱包做了横向对比，以去中心化思想为基线，为用户提供最安全的钱包。

在我们调研和多次的探讨后，排除了中心化托管的方式、Web3Auth 类型的 MPC 钱包、同时也放弃了 Metamask 这种类型的 EOA 钱包。而最终选择了 Privy 这种即由用户控制，又可以授权来进行满足跟单、挂单等操作。同时用户又持有并参与了 MPC 的过程。



## 为什么选择 Privy 和 JUP

AIME 是一款将用户资产安全放在第一位的款 DEX, 而对于钱包的开发、构建和选择一直是一件非常慎重的事情。

Privy 是一家非常优秀的企业，它们的钱包采用了 MPC 架构，并通过了 Cure53、Zellic 和 Doyensec 等公司的多项独立安全审计。

拥有 SOC2 I 及 II 安全认证。

而 Privy 采用的是非托管架构，这意味着用户完全控制着自己的资产，无人可以直接动手用户的资产。

当 AIME 需要使用用户的资产时，因交易优化、跟单等需求，需要用户授权给 AIME 后，才可以代替用户发起交易。

而这个过程用户是可以随时取消授权，将资产的管理权完全掌控在用户手中的。

同时 Privy 使用了 TEE（可信执行环境） 模式，密钥被分为多份分布在不同的安全边界，只有安全执行环境中，才可以临时重组出来用户的签名私钥，在此时才可以运用于某种特定的操作。

------

JUP 的核心目标是为 Solana 用户提供最佳的交易执行和价格发现。作为一个流动性聚合器，它连接了 Solana 上各种去中心化交易所 (DEX) 的流动性，允许用户以最优的价格和最低的滑点进行代币兑换。

其能够实时聚合 Solana 生态系统中多个 DEX（如 Raydium、Orca、Serum 等）的流动性。它通过智能路由算法，分析不同 DEX 上的价格和流动性，为用户找到最优的交易路径。

其特点：

* 智能订单路由
* 高效的执行速度
* 与 Solana 生态系统的深度集成
* 开放的 API 和 SDK

------

AIME 将用户要签名的交易通过 JUP 的核心 API  build 成为 unsignData 后，再通过 Privy 签名后得到 signTransaction，之后便将交易直接广播到链上。这使得中间没有任何人可以触碰到用户的任何信息。而通过 JUP 也可以得到优质的 buildData。


## 概述

这是一个使用 Fastify 构建的强大且可扩展的区块链钱包服务，提供交易管理和区块链交互功能。该服务集成了 Privy 用于钱包认证，以及 Jupiter 用于 Solana DEX 聚合。

## 功能
- 支持多链，不同区块链网络的集成
- 交易创建和签名
- 交易广播
- 支持 SVM 链的 MEV（最大可提取价值）
- 健康检查端点
- 启用 CORS
- 全面的错误处理
- 日志系统
- **Privy 集成**：安全的钱包认证和管理
- **Jupiter 集成**：Solana DEX 聚合以实现最佳代币交换

## 架构

该服务遵循清晰的架构模式，包含以下组件：

### 控制器
- `TransactionController`：处理交易操作的 HTTP 请求
- 转账操作
- 交易操作

### 服务
- `TransactionService`：交易处理的核心业务逻辑
- `SignService`：处理交易签名
- `CreateTxService`：创建不同类型的交易
- `BroadcastService`：管理向区块链网络的交易广播

### 外部集成
Privy：钱包认证和管理
安全钱包 API 集成
认证密钥管理
Jupiter：Solana DEX 聚合
代币交换的最佳路径查找
基于 API 的交易执行集成
## API 端点

### 健康检查
```
GET /health
```
返回服务状态。

### 交易端点
- 转账交易
- 支持 MEV 的交易

## 环境变量

所需环境变量：
- `PORT`：服务器端口（默认：3001）
- `PRIVY_APP_ID`：Privy 应用程序 ID
- `PRIVY_APP_SECRET`：Privy 应用程序密钥
- `PRIVY_APP_AUTH_KEY`：Privy 授权私钥
- `JUP_BASE_PATH`：Jupiter API 基础路径
- `JUP_API_KEY`：Jupiter API 密钥

## 入门指南
安装依赖：

```bash
npm install
```

设置环境变量：
创建一个 `.env` 文件，并配置以下内容：

```env
PORT=3001
PRIVY_APP_ID=your_privy_app_id
PRIVY_APP_SECRET=your_privy_app_secret
PRIVY_APP_AUTH_KEY=your_privy_auth_key
JUP_BASE_PATH=your_jupiter_base_path
JUP_API_KEY=your_jupiter_api_key
```

启动服务器：
```bash
npm start
```

## 错误处理

- 该服务实现了全面的错误处理，包括：
- HTTP 状态码
- 错误信息
- 交易哈希验证
- 详细日志记录

## 安全性

- CORS 保护
- 环境变量配置
- 安全的交易签名
- 交易哈希验证
- Privy 认证集成
- 安全的 API 密钥管理

## 依赖

- Fastify：Web 框架
- TypeScript：编程语言
- dotenv：环境配置
- @privy-io/server-auth：Privy 认证
- @jup-ag/api：Jupiter DEX 聚合
- 其他区块链相关依赖

## 许可证

[在此处添加您的许可证信息]

## Link

* <img src=".assets/LOGO.png" alt="aime" width="32px" /> - [AIME](https://aime.dog)
* <img src="https://framerusercontent.com/images/oPqxoNxeHrQ9qgbjTUGuANdXdQ.png" alt="Privy" width="32px" /> - [Privy](https://www.privy.io/)
* <img src="https://dev.jup.ag/img/jupiter-logo.svg" alt="JUP" width="32px" /> - [JUP](https://dev.jup.ag/docs/)