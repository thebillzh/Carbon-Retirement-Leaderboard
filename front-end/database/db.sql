-- User
CREATE TABLE `t_users` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'auto increment primary key',
  `wallet_pub` varchar (127) NOT NULL DEFAULT '' COMMENT 'wallet public key',
  `wallet_type` varchar (127) NOT NULL DEFAULT '' COMMENT 'wallet type',
  `uname` varchar (127) NOT NULL DEFAULT '' COMMENT 'name',
  `face` varchar (255) NOT NULL DEFAULT '' COMMENT 'avatar',
  `gender` tinyint (1) NOT NULL DEFAULT 0 COMMENT 'gender 0 secret 1 female 2 male',
  `twitter` varchar (255) NOT NULL DEFAULT '' COMMENT 'twitter',
  `email` varchar (255) NOT NULL DEFAULT '' COMMENT 'email',
  `about` text NOT NULL DEFAULT '' COMMENT 'about',
  `last_login_time` datetime NOT NULL DEFAULT '0001-01-01 00:00:00' COMMENT 'last login time',
  `mtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'modify time',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  PRIMARY KEY (`id`),
  key `ix_mtime` USING btree (`mtime`),
  unique key `uk_wallet_pub` USING btree (`wallet_pub`)
) ENGINE = innodb DEFAULT CHARACTER SET = "utf8mb4" COLLATE = "utf8mb4_general_ci" COMMENT = 'User Table';
