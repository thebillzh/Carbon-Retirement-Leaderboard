package utils

const (
	_jwtV4ExpireAt  = "exp"
	_jwtV4IssuedAt  = "iat"
	_jwtV4NotBefore = "nbf"

	_jwtV4Mid      = "mid"
	_jwtV4Username = "username"
	_jwtV4Role     = "role"
	_jwtV4Uname    = "uname"
	_jwtV4Face     = "face"
)

var (
	JWTKey = []byte("efd2b0381fcc4d18751b59c47ba4446b")
)
