# =========================
# Frontend Web (Vite + React)
# =========================

WEB_DIR=apps/web

.PHONY: help install dev build preview clean reset

help:
	@echo "Available commands:"
	@echo "  make install   - Install dependencies"
	@echo "  make dev       - Run dev server"
	@echo "  make build     - Build production"
	@echo "  make preview   - Preview production build"
	@echo "  make clean     - Remove node_modules"
	@echo "  make reset     - Clean + reinstall"

install:
	cd $(WEB_DIR) && npm install

dev:
	cd $(WEB_DIR) && npm run dev

build:
	cd $(WEB_DIR) && npm run build

preview:
	cd $(WEB_DIR) && npm run preview

clean:
	cd $(WEB_DIR) && rm -rf node_modules package-lock.json node_modules/.vite

reset:
	make clean
	make install
prettier:
	cd $(WEB_DIR) && npm run format
