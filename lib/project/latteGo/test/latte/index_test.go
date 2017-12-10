package latte

import (
	"testing"
)

/*
func Test_event(t *testing.T) {
	event := &Event{};
	event.On("start", func(a ...interface{}){
		t.Log(a[0], a[1]);
	});
	event.Emit("start", 1, "2");
}*/

func Test_once(t *testing.T) {
	t.Log(Latte())
}
