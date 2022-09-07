package cron

/*
暴露一个全局的cron对象接口，以此打通

使用方只需要做两件事：
1. 直接引用package，通过AddFunc注册任务。(任务会自动start，不用关心start的逻辑和地方)
2. 在合适的地方执行Stop，一般建议在main()中退出的地方

如果要定制JobWrapper，建议走 NewCronUtil的方式。
*/
import(
	"context"
	cron3 "github.com/robfig/cron/v3"
)


func Stop() {
	if _singletonUtil != nil {
		_singletonUtil.Stop()
	}
}

// AddFunc 直接使用则无法定制wrapper
func AddFunc(spec string, cmd func(ctx context.Context) error, uniqueName string, ops ...CmdOption)(cron3.EntryID, error) {
	return NewCron().AddFunc(spec, cmd, uniqueName, ops...)
}