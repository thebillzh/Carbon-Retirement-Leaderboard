package biz

type MainRepo interface {
}

type MainUseCase struct {
	repo MainRepo
}

func NewMainUseCase(repo MainRepo) *MainUseCase {
	return &MainUseCase{repo: repo}
}
