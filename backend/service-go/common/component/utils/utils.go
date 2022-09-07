package utils

import "encoding/json"

func EncodeToJsonString(data interface{}) string {
	s, _ := json.Marshal(data)
	return string(s)
}
