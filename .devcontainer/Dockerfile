# See here for image contents: https://github.com/microsoft/vscode-dev-containers/tree/v0.191.0/containers/javascript-node/.devcontainer/base.Dockerfile
ARG VARIANT="16-buster"
FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:0-${VARIANT}

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
  && apt-get -y install --no-install-recommends vim jq zsh curl wget zip unzip

RUN rm -rf /usr/bin/yarn

RUN su node -c "npm install -g npm n gitmoji-cli npm-check-updates yarn"

RUN rm -rf /root/.oh-my-zsh \
  && sh -c "$(curl -fsSL https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended \
  && chsh -s /bin/zsh \
  && git clone --quiet https://github.com/zsh-users/zsh-autosuggestions ~/.oh-my-zsh/custom/plugins/zsh-autosuggestions \
  && git clone --quiet https://github.com/zsh-users/zsh-completions ~/.oh-my-zsh/custom/plugins/zsh-completions \
  && sed -i 's/ZSH_THEME="robbyrussell"/# ZSH_THEME="robbyrussell"/g' ~/.zshrc \
  && sed -i 's/# HYPHEN_INSENSITIVE=/HYPHEN_INSENSITIVE=/g' ~/.zshrc \
  && sed -i 's/plugins=(git)/plugins=(git zsh-completions zsh-autosuggestions)/g' ~/.zshrc \
  && sed -i '/plugins=(git zsh-completions zsh-autosuggestions)/a autoload -U compinit && compinit' ~/.zshrc

RUN sh -c "$(curl -fsSL https://starship.rs/install.sh)" -- --yes \
  && echo '\neval "$(starship init zsh)"\n' >> ~/.zshrc

COPY starship.toml  /root/.config/starship.toml
