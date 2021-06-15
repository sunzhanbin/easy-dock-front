#!/bin/bash
clear
cwd=$(pwd)
function multiselect {

    # little helpers for terminal print control and key input
    ESC=$( printf "\033")
    cursor_blink_on()   { printf "$ESC[?25h"; }
    cursor_blink_off()  { printf "$ESC[?25l"; }
    cursor_to()         { printf "$ESC[$1;${2:-1}H"; }
    print_inactive()    { printf "$2   $1 "; }
    print_active()      { printf "$2  $ESC[7m $1 $ESC[27m"; }
    get_cursor_row()    { IFS=';' read -sdR -p $'\E[6n' ROW COL; echo ${ROW#*[}; }
    key_input()         {
      local key
      IFS= read -rsn1 key 2>/dev/null >&2
      if [[ $key = ""      ]]; then echo enter; fi;
      if [[ $key = $'\x20' ]]; then echo space; fi;
      if [[ $key = $'\x1b' ]]; then
        read -rsn2 key
        if [[ $key = [A ]]; then echo up;    fi;
        if [[ $key = [B ]]; then echo down;  fi;
      fi 
    }
    toggle_option()    {
      local arr_name=$1
      eval "local arr=(\"\${${arr_name}[@]}\")"
      local option=$2
      if [[ ${arr[option]} == true ]]; then
        arr[option]=
      else
        arr[option]=true
      fi
      eval $arr_name='("${arr[@]}")'
    }

    local retval=$1
    local options
    local defaults

    IFS=';' read -r -a options <<< "$2"
    if [[ -z $3 ]]; then
      defaults=()
    else
      IFS=';' read -r -a defaults <<< "$3"
    fi
    local selected=()

    for ((i=0; i<${#options[@]}; i++)); do
      selected+=("${defaults[i]}")
      printf "\n"
    done

    # determine current screen position for overwriting the options
    local lastrow=`get_cursor_row`
    local startrow=$(($lastrow - ${#options[@]}))

    # ensure cursor and input echoing back on upon a ctrl+c during read -s
    trap "cursor_blink_on; stty echo; printf '\n'; exit" 2
    cursor_blink_off

    local active=0
    while true; do
        # print options by overwriting the last lines
        local idx=0
        for option in "${options[@]}"; do
            local prefix="[ ]"
            if [[ ${selected[idx]} == true ]]; then
              prefix="[x]"
            fi

            cursor_to $(($startrow + $idx))
            if [ $idx -eq $active ]; then
                print_active "$option" "$prefix"
            else
                print_inactive "$option" "$prefix"
            fi
            ((idx++))
        done

        # user key control
        case `key_input` in
            space)  toggle_option selected $active;;
            enter)  break;;
            up)     ((active--));
                    if [ $active -lt 0 ]; then active=$((${#options[@]} - 1)); fi;;
            down)   ((active++));
                    if [ $active -ge ${#options[@]} ]; then active=0; fi;;
        esac
    done

    # cursor position back to normal
    cursor_to $lastrow
    printf "\n"
    cursor_blink_on

    eval $retval='("${selected[@]}")'
}
red_bg='\e[41;33;1m'

red_font='\e[1;31m'

green_bg='\033[0;32;1m'

green_font='\e[1;32m'

end='\033[0m'

blink='\033[05m'


default_path='packages/components'

HEAD='HEAD'

origin='origin'

input_check(){
  if [[ -z "$1" ]];then
  printf "Use the value ${red_font}$2${end}\n"
  eval `echo "$3=$2"`
  else
  printf "Use the value ${red_font}$1${end}\n"
  eval `echo "$3=$1"`
  fi
}

input(){
  printf "$1"
  read $2
}

git remote update "$origin" --prune

remote_commit=$(git rev-parse $(git rev-parse --abbrev-ref --symbolic-full-name @{u}))
current_commit=$(git rev-parse "$HEAD")


if [ "$remote_commit" != "$current_commit" ];then
  printf "${red_font}The remote commit of this branch does not match, please commit your changes and synchronize with the remote${end}"
  exit
fi

input "Enter the Path for the component packages, the default is ${green_font}$default_path${end}" component_path
input_check "$component_path" "$default_path" "component_path"

printf "${green_bg}Please choose the last version in git tags${end}\n"
select last_version in $(git tag --sort=committerdate | tail -n 20)
  do
    printf "${red_font}$last_version${end} is chosen\n"
    break
  done

rm -f tmp.txt && git diff "$last_version" HEAD --name-only --exit-code --output="tmp.txt" && open tmp.txt
# Read the updated components
# grep 'packages/core/lib/components' tmp.txt | awk -F 'components/' '{print$ 2}' | awk -F '/' '{print $1}' | uniq | tr "\n" " "
options=$(grep $( echo $component_path ) tmp.txt | awk -F 'components/' '{print$ 2}' | awk -F '/' '{print $1}' | uniq | tr "\n" ";")
printf "Select the packages that you ${red_font}DO NOT${end} want to update the version: \n"
printf "Use ${red_font}SPACE${end} for toggling the option, ${red_font}ENTER${end} for confirming selection\n"

OLD_IFS="$IFS" 
IFS=";"
opt_arr=($options)
IFS="$OLD_IFS"

for i in "${!opt_arr[@]}"; do
  if [ -f "$PWD/$component_path/${opt_arr[$i]}/package.json" ]; then
    true_options+="${opt_arr[$i]};"
  fi
done

multiselect result "$true_options"

OLD_IFS="$IFS" 
IFS=";"
opt_arr=($true_options)
IFS="$OLD_IFS"



for i in "${!opt_arr[@]}"; do
  if [ "${result[$i]}" == "true" ]; then
    cd "$cwd"
  else
    printf "Patching version for component ${green_font}${opt_arr[$i]}${end}...\n"
    cd "$cwd/$component_path/${opt_arr[$i]}" && npm version patch
    rollup_args+=$(node -e "console.log(JSON.parse(\`$(cat $cwd/$component_path/${opt_arr[$i]}/package.json)\`)['name'])")
    rollup_args+=" "
    cd "$cwd"
	fi
done

echo "$rollup_args"


cd $component_path && npm run build "$rollup_args"

rm -f tmp.txt




# for i in "${!result[@]}"; do
# 	if [ "${result[$i]}" == "true" ]; then
# 		CHECKED+="(${opt_arr[$i]})"
# 	fi
# done

# printf "${CHECKED}\n${options}\n"



