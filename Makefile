all: clean test build

clean:
	rm -rf bin dist

restore-deps:
	go mod tidy

test:
	go test -short -v ./...

vet:
	go vet ./...

.PHONY: backend
backend:
	cd backend && GOOS=linux GOARCH=amd64 go build -o ../bin/skismart *.go

frontend:
	npm run build -- --mode prod

build: backend frontend

## Remote command
## assumes cs330 is setup in ~/.ssh/config
## Host cs300
#	Hostname 172.174.105.76
#	User azureuser
# 	IdentityFile ~./.ssh/cs330_1.pem

deploy:
	ssh cs330 "rm -rf skismart skismart.js"
	scp -r -C dist cs330:/home/azureuser/skismart.js
	scp -C bin/skismart cs330:/home/azureuser/skismart

remote-run:
	read -p "Enter server db password: " db_pass; \
	ssh cs330 "nohup ./skismart --password $$db_pass --react-dir skismart.js > skismart.log 2>&1 &"

remote-stop:
	ssh cs330 "pkill skismart" || true