# Makefile for building a Wails application

.PHONY: all clean build-windows build-macos  frontend 


FRONTEND_DIR = frontend
BUILD_DIR = build/bin
WAILS = wails
PNPM = pnpm
# 清理构建文件
clean:
	rm -rf $(BUILD_DIR)/*
	rm -rf $(FRONTEND_DIR)/dist


# 构建前端
frontend:
	cd $(FRONTEND_DIR) && $(PNPM) install && $(PNPM) build

build-macos: clean frontend 
	$(WAILS) build 