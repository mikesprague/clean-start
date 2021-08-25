# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.191.0/containers/javascript-node/.devcontainer/base.Dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

# install some common utils
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends curl wget zip unzip git jq nano vim zsh

# install github cli
RUN export DEBIAN_FRONTEND=noninteractive \
  && curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg \
  && echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null \
  && sudo apt-get update \
  && sudo apt-get -y install gh

# update npm and install n (node version manager)
RUN npm install -g npm n

# use n to make sure we're on latest v16 of nodejs
# and install some global npm dependencies
# (removes existing yarn executable first or latest version fails to install)
RUN rm -rf /usr/bin/yarn \
  && n 16 && npm i -g npm gitmoji-cli npm-check-updates yarn

# install and customize oh-my-zsh
RUN rm -rf /root/.oh-my-zsh \
  && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
  && chsh -s /bin/zsh \
  && git clone --quiet https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
  && git clone --quiet https://github.com/zsh-users/zsh-completions ~/.oh-my-zsh/custom/plugins/zsh-completions \
  && sed -i 's/ZSH_THEME="robbyrussell"/# ZSH_THEME="robbyrussell"/g' ~/.zshrc \
  && sed -i 's/# HYPHEN_INSENSITIVE=/HYPHEN_INSENSITIVE=/g' ~/.zshrc \
  && sed -i 's/plugins=(git)/plugins=(git zsh-completions zsh-autosuggestions npm yarn)/g' ~/.zshrc \
  && sed -i '/plugins=(git zsh-completions zsh-autosuggestions npm yarn)/a autoload -U compinit && compinit' ~/.zshrc

# set some shell aliases and options and set some git aliases and options
RUN echo '\nalias la="ls -lah"\nalias cl="clear"\nalias npmgls="npm -g ls --depth=0"\n' >> ~/.zshrc \
  && echo '\nalias aptupdate="sudo apt update && sudo apt upgrade"\n' >> ~/.zshrc \
  && echo '\nalias alias ncud="ncu --dep dev -u && yarn"\nalias ncup="ncu --dep prod -u && yarn"\n' >> ~/.zshrc \
  && echo '\n\nexport LS_COLORS="su=00:sg=00:ca=00:ow=01;36;40"\n' >> ~/.zshrc \
  && echo '\nzstyle ":completion:*" list-colors "${(@s.:.)LS_COLORS}"\n' >> ~/.zshrc \
  && echo '\neval "$(gh completion --shell zsh)"\n' >> ~/.zshrc \
  && git config  --global --add alias.st status \
  && git config --global --add alias.lsd 'log --pretty=format:"%C(yellow)%h%Cred%d\\ %Creset%s%Cblue\\ [%cn]" --decorate' \
  && git config --global --add commit.gpgsign true \
  && git config --global --add tag.gpgsign true \
  && git config --global --add tag.tag.forcesignannotated true

# install starship shell promopt
RUN sh -c "$(curl -fsSL https://starship.rs/install.sh)" -- --yes \
  && echo '\neval "$(starship init zsh)"\n' >> ~/.zshrc

# add config file for starship prompt
COPY starship.toml  /root/.config/starship.toml
