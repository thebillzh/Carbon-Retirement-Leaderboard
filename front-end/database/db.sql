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

-- Retirement Table(Go service)
CREATE TABLE `t_go_retirements` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'auto increment primary key',
  `creation_tx` varchar (255) NOT NULL DEFAULT '' COMMENT 'creation hash of the certificate',
  `creator_address` varchar (255) NOT NULL DEFAULT '' COMMENT 'creator of the certificate',
  `beneficiary_address` varchar (255) NOT NULL DEFAULT '' COMMENT 'beneficiary of the certificate',
  `amount` decimal(65,18) NOT NULL DEFAULT 0 COMMENT 'amount of retirement',
  `token_address` varchar (255) NOT NULL DEFAULT '' COMMENT 'token address',
  `token_name` varchar (255) NOT NULL DEFAULT '' COMMENT 'token name',
  `token_type` varchar (255) NOT NULL DEFAULT '' COMMENT 'type of token such as nct, bct...',
  `retirement_time` datetime NOT NULL DEFAULT '0001-01-01 00:00:00' COMMENT 'time of retirement',
  `mtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'modify time',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  PRIMARY KEY (`id`),
  key `ix_mtime` USING btree (`mtime`),
  key `ix_beneficiary_address` USING btree (`beneficiary_address`)
) ENGINE = innodb DEFAULT CHARACTER SET = "utf8mb4" COLLATE = "utf8mb4_general_ci" COMMENT = 'Retirement Table(Go service)';

-- ENS Table(Go service)
CREATE TABLE `t_go_ens` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'auto increment primary key',
  `wallet_pub` varchar (127) NOT NULL DEFAULT '' COMMENT 'wallet public key',
  `ens` varchar (255) NOT NULL DEFAULT '' COMMENT 'creator of the certificate',
  `mtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'modify time',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  PRIMARY KEY (`id`),
  key `ix_mtime` USING btree (`mtime`),
  unique key `uk_wallet_pub` USING btree (`wallet_pub`)
) ENGINE = innodb DEFAULT CHARACTER SET = "utf8mb4" COLLATE = "utf8mb4_general_ci" COMMENT = 'ENS Table(Go service)';

-- Cache Table(Go service)
CREATE TABLE `t_go_caches` (
  `id` bigint UNSIGNED NOT NULL AUTO_INCREMENT COMMENT 'auto increment primary key',
  `cache_key` varchar (127) NOT NULL DEFAULT '' COMMENT 'cache key',
  `cache_value` varchar (255) NOT NULL DEFAULT '' COMMENT 'cached value',
  `mtime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT 'modify time',
  `ctime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT 'create time',
  PRIMARY KEY (`id`),
  key `ix_mtime` USING btree (`mtime`),
  unique key `uk_cache_key` USING btree (`cache_key`)
) ENGINE = innodb DEFAULT CHARACTER SET = "utf8mb4" COLLATE = "utf8mb4_general_ci" COMMENT = 'Cache Table(Go service)';
