<?php

namespace SilverStripe\View;

use InvalidArgumentException;
use SilverStripe\Control\HTTPResponse;
use SilverStripe\Core\Config\Config;
use SilverStripe\Core\Flushable;
use SilverStripe\Dev\Deprecation;

/**
 * Requirements tracker for JavaScript and CSS.
 */
class Requirements implements Flushable
{

    /**
     * Flag whether combined files should be deleted on flush.
     *
     * By default all combined files are deleted on flush. If combined files are stored in source control,
     * and thus updated manually, you might want to turn this on to disable this behaviour.
     *
     * @config
     * @var bool
     */
    private static $disable_flush_combined = false;

    /**
     * Triggered early in the request when a flush is requested
     */
    public static function flush()
    {
        $disabled = Config::inst()->get(static::class, 'disable_flush_combined');
        if (!$disabled) {
            self::delete_all_combined_files();
        }
    }

    /**
     * Enable combining of css/javascript files.
     *
     * @param bool $enable
     */
    public static function set_combined_files_enabled($enable)
    {
        self::backend()->setCombinedFilesEnabled($enable);
    }

    /**
     * Checks whether combining of css/javascript files is enabled.
     *
     * @return bool
     */
    public static function get_combined_files_enabled()
    {
        return self::backend()->getCombinedFilesEnabled();
    }

    /**
     * Set the relative folder e.g. 'assets' for where to store combined files
     *
     * @param string $folder Path to folder
     */
    public static function set_combined_files_folder($folder)
    {
        self::backend()->setCombinedFilesFolder($folder);
    }

    /**
     * Set whether to add caching query params to the requests for file-based requirements.
     * Eg: themes/myTheme/js/main.js?m=123456789. The parameter is a timestamp generated by
     * filemtime. This has the benefit of allowing the browser to cache the URL infinitely,
     * while automatically busting this cache every time the file is changed.
     *
     * @param bool
     */
    public static function set_suffix_requirements($var)
    {
        self::backend()->setSuffixRequirements($var);
    }

    /**
     * Check whether we want to suffix requirements
     *
     * @return bool
     */
    public static function get_suffix_requirements()
    {
        return self::backend()->getSuffixRequirements();
    }

    /**
     * Instance of the requirements for storage. You can create your own backend to change the
     * default JS and CSS inclusion behaviour.
     *
     * @var Requirements_Backend
     */
    private static $backend = null;

    /**
     * @return Requirements_Backend
     */
    public static function backend()
    {
        if (!self::$backend) {
            self::$backend = Requirements_Backend::create();
        }
        return self::$backend;
    }

    /**
     * Setter method for changing the Requirements backend
     *
     * @param Requirements_Backend $backend
     */
    public static function set_backend(Requirements_Backend $backend)
    {
        self::$backend = $backend;
    }

    /**
     * Register the given JavaScript file as required.
     *
     * @param string $file Relative to docroot
     * @param array $options List of options. Available options include:
     * - 'provides' : List of scripts files included in this file
     * - 'async' : Boolean value to set async attribute to script tag
     * - 'defer' : Boolean value to set defer attribute to script tag
     */
    public static function javascript($file, $options = array())
    {
        self::backend()->javascript($file, $options);
    }

    /**
     * Register the given JavaScript code into the list of requirements
     *
     * @param string     $script       The script content as a string (without enclosing <script> tag)
     * @param string|int $uniquenessID A unique ID that ensures a piece of code is only added once
     */
    public static function customScript($script, $uniquenessID = null)
    {
        self::backend()->customScript($script, $uniquenessID);
    }

    /**
     * Return all registered custom scripts
     *
     * @return array
     */
    public static function get_custom_scripts()
    {
        return self::backend()->getCustomScripts();
    }

    /**
     * Register the given CSS styles into the list of requirements
     *
     * @param string     $script       CSS selectors as a string (without enclosing <style> tag)
     * @param string|int $uniquenessID A unique ID that ensures a piece of code is only added once
     */
    public static function customCSS($script, $uniquenessID = null)
    {
        self::backend()->customCSS($script, $uniquenessID);
    }

    /**
     * Add the following custom HTML code to the <head> section of the page
     *
     * @param string     $html         Custom HTML code
     * @param string|int $uniquenessID A unique ID that ensures a piece of code is only added once
     */
    public static function insertHeadTags($html, $uniquenessID = null)
    {
        self::backend()->insertHeadTags($html, $uniquenessID);
    }

    /**
     * Include the content of the given JavaScript file in the list of requirements. Dollar-sign
     * variables will be interpolated with values from $vars similar to a .ss template.
     *
     * @param string         $file         The template file to load, relative to docroot
     * @param string[]|int[] $vars         The array of variables to interpolate.
     * @param string|int     $uniquenessID A unique ID that ensures a piece of code is only added once
     */
    public static function javascriptTemplate($file, $vars, $uniquenessID = null)
    {
        self::backend()->javascriptTemplate($file, $vars, $uniquenessID);
    }

    /**
     * Register the given stylesheet into the list of requirements.
     *
     * @param string $file  The CSS file to load, relative to site root
     * @param string $media Comma-separated list of media types to use in the link tag
     *                      (e.g. 'screen,projector')
     */
    public static function css($file, $media = null)
    {
        self::backend()->css($file, $media);
    }

    /**
     * Registers the given themeable stylesheet as required.
     *
     * A CSS file in the current theme path name 'themename/css/$name.css' is first searched for,
     * and it that doesn't exist and the module parameter is set then a CSS file with that name in
     * the module is used.
     *
     * @param string $name   The name of the file - eg '/css/File.css' would have the name 'File'
     * @param string $media  Comma-separated list of media types to use in the link tag
     *                       (e.g. 'screen,projector')
     */
    public static function themedCSS($name, $media = null)
    {
        self::backend()->themedCSS($name, $media);
    }

    /**
     * Registers the given themeable javascript as required.
     *
     * A javascript file in the current theme path name 'themename/javascript/$name.js' is first searched for,
     * and it that doesn't exist and the module parameter is set then a javascript file with that name in
     * the module is used.
     *
     * @param string $name   The name of the file - eg '/javascript/File.js' would have the name 'File'
     * @param string $type  Comma-separated list of types to use in the script tag
     *                       (e.g. 'text/javascript,text/ecmascript')
     */
    public static function themedJavascript($name, $type = null)
    {
        self::backend()->themedJavascript($name, $type);
    }

    /**
     * Clear either a single or all requirements
     *
     * Caution: Clearing single rules added via customCSS and customScript only works if you
     * originally specified a $uniquenessID.
     *
     * @param string|int $fileOrID
     */
    public static function clear($fileOrID = null)
    {
        self::backend()->clear($fileOrID);
    }

    /**
     * Restore requirements cleared by call to Requirements::clear
     */
    public static function restore()
    {
        self::backend()->restore();
    }

    /**
     * Block inclusion of a specific file
     *
     * The difference between this and {@link clear} is that the calling order does not matter;
     * {@link clear} must be called after the initial registration, whereas {@link block} can be
     * used in advance. This is useful, for example, to block scripts included by a superclass
     * without having to override entire functions and duplicate a lot of code.
     *
     * Note that blocking should be used sparingly because it's hard to trace where an file is
     * being blocked from.
     *
     * @param string|int $fileOrID
     */
    public static function block($fileOrID)
    {
        self::backend()->block($fileOrID);
    }

    /**
     * Remove an item from the block list
     *
     * @param string|int $fileOrID
     */
    public static function unblock($fileOrID)
    {
        self::backend()->unblock($fileOrID);
    }

    /**
     * Removes all items from the block list
     */
    public static function unblock_all()
    {
        self::backend()->unblockAll();
    }

    /**
     * Update the given HTML content with the appropriate include tags for the registered
     * requirements. Needs to receive a valid HTML/XHTML template in the $content parameter,
     * including a head and body tag.
     *
     * @param string $content      HTML content that has already been parsed from the $templateFile
     *                             through {@link SSViewer}
     * @return string HTML content augmented with the requirements tags
     */
    public static function includeInHTML($content)
    {
        if (func_num_args() > 1) {
            Deprecation::notice(
                '5.0',
                '$templateFile argument is deprecated. includeInHTML takes a sole $content parameter now.'
            );
            $content = func_get_arg(1);
        }

        return self::backend()->includeInHTML($content);
    }

    /**
     * Attach requirements inclusion to X-Include-JS and X-Include-CSS headers on the given
     * HTTP Response
     *
     * @param HTTPResponse $response
     */
    public static function include_in_response(HTTPResponse $response)
    {
        self::backend()->includeInResponse($response);
    }

    /**
     * Add i18n files from the given javascript directory. SilverStripe expects that the given
     * directory will contain a number of JavaScript files named by language: en_US.js, de_DE.js,
     * etc.
     *
     * @param string $langDir  The JavaScript lang directory, relative to the site root, e.g.,
     *                         'framework/javascript/lang'
     * @param bool   $return   Return all relative file paths rather than including them in
     *                         requirements
     * @param bool $langOnly @deprecated 4.1...5.0 as i18n.js should be included manually in your project
     *
     * @return array
     */
    public static function add_i18n_javascript($langDir, $return = false, $langOnly = false)
    {
        return self::backend()->add_i18n_javascript($langDir, $return);
    }

    /**
     * Concatenate several css or javascript files into a single dynamically generated file. This
     * increases performance by fewer HTTP requests.
     *
     * The combined file is regenerated based on every file modification time. Optionally a
     * rebuild can be triggered by appending ?flush=1 to the URL.
     *
     * All combined files will have a comment on the start of each concatenated file denoting their
     * original position.
     *
     * CAUTION: You're responsible for ensuring that the load order for combined files is
     * retained - otherwise combining JavaScript files can lead to functional errors in the
     * JavaScript logic, and combining CSS can lead to incorrect inheritance. You can also
     * only include each file once across all includes and comibinations in a single page load.
     *
     * CAUTION: Combining CSS Files discards any "media" information.
     *
     * Example for combined JavaScript:
     * <code>
     * Requirements::combine_files(
     *  'foobar.js',
     *  array(
     *        'mysite/javascript/foo.js',
     *        'mysite/javascript/bar.js',
     *    )
     * );
     * </code>
     *
     * Example for combined CSS:
     * <code>
     * Requirements::combine_files(
     *  'foobar.css',
     *    array(
     *        'mysite/javascript/foo.css',
     *        'mysite/javascript/bar.css',
     *    )
     * );
     * </code>
     *
     * @param string $combinedFileName Filename of the combined file relative to docroot
     * @param array  $files            Array of filenames relative to docroot
     * @param array  $options          Array of options for combining files. Available options are:
     * - 'media' : If including CSS Files, you can specify a media type
     * - 'async' : If including JavaScript Files, boolean value to set async attribute to script tag
     * - 'defer' : If including JavaScript Files, boolean value to set defer attribute to script tag
     */
    public static function combine_files($combinedFileName, $files, $options = array())
    {
        if (is_string($options)) {
            throw new InvalidArgumentException("Invalid $options");
        }
        self::backend()->combineFiles($combinedFileName, $files, $options);
    }

    /**
     * Return all combined files; keys are the combined file names, values are lists of
     * associative arrays with 'files', 'type', and 'media' keys for details about this
     * combined file.
     *
     * @return array
     */
    public static function get_combine_files()
    {
        return self::backend()->getCombinedFiles();
    }

    /**
     * Deletes all generated combined files in the configured combined files directory,
     * but doesn't delete the directory itself
     */
    public static function delete_all_combined_files()
    {
        self::backend()->deleteAllCombinedFiles();
    }

    /**
     * Re-sets the combined files definition. See {@link Requirements_Backend::clear_combined_files()}
     */
    public static function clear_combined_files()
    {
        self::backend()->clearCombinedFiles();
    }

    /**
     * Do the heavy lifting involved in combining the combined files.
     */
    public static function process_combined_files()
    {
        self::backend()->processCombinedFiles();
    }

    /**
     * Set whether you want to write the JS to the body of the page rather than at the end of the
     * head tag.
     *
     * @return bool
     */
    public static function get_write_js_to_body()
    {
        return self::backend()->getWriteJavascriptToBody();
    }

    /**
     * Set whether you want to write the JS to the body of the page rather than at the end of the
     * head tag.
     *
     * @param bool
     */
    public static function set_write_js_to_body($var)
    {
        self::backend()->setWriteJavascriptToBody($var);
    }

    /**
     * Get whether to force the JavaScript to end of the body. Useful if you use inline script tags
     * that don't rely on scripts included via {@link Requirements::javascript()).
     *
     * @return bool
     */
    public static function get_force_js_to_bottom()
    {
        return self::backend()->getForceJSToBottom();
    }

    /**
     * Set whether to force the JavaScript to end of the body. Useful if you use inline script tags
     * that don't rely on scripts included via {@link Requirements::javascript()).
     *
     * @param bool $var If true, force the JavaScript to be included at the bottom of the page
     */
    public static function set_force_js_to_bottom($var)
    {
        self::backend()->setForceJSToBottom($var);
    }

    /**
     * Check if JS minification is enabled
     *
     * @return bool
     */
    public static function get_minify_combined_js_files()
    {
        return self::backend()->getMinifyCombinedJSFiles();
    }

    /**
     * Enable or disable js minification
     *
     * @param bool $minify
     */
    public static function set_minify_combined_js_files($minify)
    {
        self::backend()->setMinifyCombinedJSFiles($minify);
    }

    /**
     * Check if header comments are written
     *
     * @return bool
     */
    public static function get_write_header_comments()
    {
        return self::backend()->getWriteHeaderComment();
    }

    /**
     * Flag whether header comments should be written for each combined file
     *
     * @param bool $write
     */
    public function set_write_header_comments($write)
    {
        self::backend()->setWriteHeaderComment($write);
    }


    /**
     * Output debugging information
     */
    public static function debug()
    {
        self::backend()->debug();
    }
}
